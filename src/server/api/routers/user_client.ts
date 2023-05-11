import { z } from "zod";
import { DeviceType, Log } from "@prisma/client";

const DeviceTypeZod: z.ZodType<DeviceType> = z.enum(['MOUNTEDv1', 'PERSONALv1']);

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { DataType } from "~/utils/DataTypes";

const MacAddressType = z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/);

type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never

export const userClientRouter = createTRPCRouter({
    getAllDevices: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input, ctx }) => {
            const devices = await ctx.prisma.device.findMany({
                where: {
                    userId: input.userId
                }
            })
            // console.log(devices);
            return devices;
        }),
    registerDevice: protectedProcedure
        .input(z.object({ mac_addr: MacAddressType, userId: z.string(), type: DeviceTypeZod }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.device.create({
                data: {
                    id: input.mac_addr,
                    name: input.mac_addr,
                    userId: input.userId,
                    deviceType: input.type,
                    info: {}
                }
            })
            return "device added"
        }),
    nameDevice: protectedProcedure
        .input(z.object({ id: MacAddressType, name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const test = await ctx.prisma.device.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name
                }
            })
            // console.log(test);
            return "device renamed"
        }),
    deleteDevice: protectedProcedure
        .input(z.object({ id: MacAddressType }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.log.deleteMany({
                where: {
                    deviceId: input.id
                }
            })

            await ctx.prisma.device.delete({
                where: {
                    id: input.id
                }
            })
            return "device deleted"
        }),
    transferDevice: protectedProcedure
        .input(z.object({ id: MacAddressType, newAccountId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const newAccount = await ctx.prisma.account.findUnique({
                where: {
                    id: input.newAccountId
                }
            })

            if (!newAccount) {
                return "account does not exist"
            }

            await ctx.prisma.device.update({
                where: {
                    id: input.id
                },
                data: {
                    userId: input.newAccountId
                }
            })
            return "device transferred"
        }),
    deleteDeviceLogs: protectedProcedure
        .input(z.object({ deviceId: MacAddressType, datetimeParams: z.string() }))
        // .input(z.object({ deviceId: MacAddressType, datetimeParams: z.string(), dataParams: z.any() }))
        .mutation(async ({ input, ctx }) => {
            const { count } = await ctx.prisma.log.deleteMany({
                where: {
                    deviceId: input.deviceId,
                    datetime: input.datetimeParams,
                    // data: input.dataParams,
                }
            })
            return `${count} logs deleted`
        }),
    fetchDeviceLogs: protectedProcedure
        .input(z.object({ userId: z.string(), deviceIds: z.optional(z.array(MacAddressType)), datetimeParams: z.optional(z.string()) }))
        .query(async ({ input, ctx }) => {
            const datetimeParams: undefined | { gt?: Date, lt?: Date, gte?: Date, lte?: Date}
                = input.datetimeParams ? JSON.parse(input.datetimeParams) as { gt?: Date, lt?: Date, gte?: Date, lte?: Date} : undefined;

            const logs: Log[] = await ctx.prisma.log.findMany({
                where: {
                    deviceId: {
                        in: input.deviceIds,
                    },
                    device: {
                        userId: input.userId,
                    },
                    datetime: {
                        gte: datetimeParams?.gte ? new Date(datetimeParams?.gte) : undefined,
                        lt: datetimeParams?.lt ? new Date(datetimeParams?.lt) : undefined,
                    }
                    // data: input.dataParams,
                }
            })
            const parsedLogs = logs.map(log => ({
                datetime: log.datetime,
                deviceId: log.deviceId,
                ...(log.data as DataType)
            }));
            return parsedLogs
        }),
    fetchDeviceLogsMonometric: protectedProcedure
        .input(z.object({ key: z.string(), ct: z.optional(z.number()), userId: z.string(), deviceIds: z.optional(z.array(MacAddressType)), datetimeParams: z.optional(z.string()) }))
        .query(async ({ input, ctx }) => {
            const datetimeParams: undefined | { gt?: Date, lt?: Date, gte?: Date, lte?: Date}
                = input.datetimeParams ? JSON.parse(input.datetimeParams) as { gt?: Date, lt?: Date, gte?: Date, lte?: Date} : undefined;

            const logs: Log[] = await ctx.prisma.log.findMany({
                where: {
                    deviceId: {
                        in: input.deviceIds,
                    },
                    device: {
                        userId: input.userId,
                    },
                    datetime: {
                        gte: datetimeParams?.gte ? new Date(datetimeParams?.gte) : undefined,
                        lt: datetimeParams?.lt ? new Date(datetimeParams?.lt) : undefined,
                    }
                    // data: input.dataParams,
                }
            })
            const parsedLogs = logs.map(log => ({
                datetime: log.datetime,
                deviceId: log.deviceId,
                [input.key]: log.data ? (log.data as DataType)[input.key as keyof DataType] : undefined
            })).filter(log => log.datetime.getTime() > (new Date("01-01-2015")).getTime())
               .filter(log => log[input.key] !== undefined);

            const ct = input.ct ? input.ct : 600;
            console.log(parsedLogs.length)

            if (parsedLogs.length < ct) {
                return parsedLogs;
            }

            const filteredLogs = [];
            const minDate = datetimeParams?.gte ? new Date(datetimeParams?.gte) : parsedLogs.reduce((acc, curr) => acc.datetime.getTime() < curr.datetime.getTime() ? acc : curr).datetime;
            const maxDate = datetimeParams?.lt ? new Date(datetimeParams?.lt) : parsedLogs.reduce((acc, curr) => acc.datetime.getTime() > curr.datetime.getTime() ? acc : curr).datetime;
            if (!minDate || !maxDate) {
                return parsedLogs;
            }
            const step = (maxDate.getTime() - minDate.getTime()) / ct;
            for (let i = minDate.getTime(); i < maxDate.getTime(); i += step) {
                const filtered = parsedLogs.filter(log => log.datetime.getTime() >= i && log.datetime.getTime() < i + step);
                if (filtered.length > 0) {
                    const smoothedVal = filtered.reduce((acc, curr) => acc + (curr[input.key] as number), 0) / filtered.length;
                    if (isNaN(smoothedVal) || smoothedVal === 0) {
                        continue;
                    }
                    filteredLogs.push({
                        datetime: new Date(i),
                        [input.key]: smoothedVal,
                    })
                }
            }
            console.log(minDate, maxDate, step, filteredLogs.length)

            return filteredLogs;
        }),
    // gets the most recent log from each device in the list
    fetchLatestLogsFromDeviceList: protectedProcedure
        .input(z.object({ userId: z.string(), deviceIds: z.array(MacAddressType) }))
        .query(async ({ input, ctx }) => {
            const logs: Log[] = await ctx.prisma.log.findMany({
                where: {
                    deviceId: {
                        in: input.deviceIds,
                    },
                    device: {
                        userId: input.userId,
                    },
                },
                orderBy: {
                    datetime: "desc"
                },
                take: 1,
            })
            const parsedLogs = logs.map(log => ({
                datetime: log.datetime,
                deviceId: log.deviceId,
                ...(log.data as object)
            }));
            return parsedLogs
        }),
    // gets the most recent log from each device from the user
    fetchLatestLogs: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input, ctx }) => {
            // parse and return the most recent log from each device along with the device name and type
            const devices = await ctx.prisma.device.findMany({
                where: {
                    userId: input.userId
                }
            })
            const parsedLogs = await Promise.all(devices.map(async (device) => {
                const log = await ctx.prisma.log.findFirst({
                    where: {
                        deviceId: device.id,
                    },
                    orderBy: {
                        datetime: "desc"
                    },
                })
                return {
                    deviceName: device.name,
                    deviceType: device.deviceType,
                    deviceInfo: device.info,
                    log: log
                }
            }))

            // filter out devices that have no logs
            // and map the logs to the correct format
            const filteredLogs = parsedLogs.filter(value => value.log !== null).map(value => {
                const log = value.log as Log;
                return {
                    datetime: log.datetime,
                    deviceId: log.deviceId,
                    deviceName: value.deviceName,
                    deviceType: value.deviceType,
                    deviceInfo: value.deviceInfo,
                    data: log.data,
                }
            })

            return filteredLogs
        }),
    changeDevicePosition: protectedProcedure
        .input(z.object({ id: MacAddressType, x: z.number(), y: z.number() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.device.update({
                where: {
                    id: input.id,
                },

                data: {
                    info: {
                        x: input.x,
                        y: input.y,
                    }
                }
            })
            return "device position changed"
        }),
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
});
