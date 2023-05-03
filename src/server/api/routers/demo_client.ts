import { z } from "zod";
import { DeviceType, Log } from "@prisma/client";

const DeviceTypeZod: z.ZodType<DeviceType> = z.enum(['MOUNTEDv1', 'PERSONALv1']);

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { env } from "process";
import { DataType } from "~/utils/DataTypes";

const MacAddressType = z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/);

export const demoClientRouter = createTRPCRouter({
    getAllDevices: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input, ctx }) => {
            const devices = await ctx.prisma.device.findMany({
                where: {
                    userId: env.DEMO_USER_ID as string
                }
            })
            // console.log(devices);
            return devices;
        }),
    registerDevice: publicProcedure
        .input(z.object({ mac_addr: MacAddressType, userId: z.string(), type: DeviceTypeZod }))
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.device.create({
                data: {
                    id: input.mac_addr,
                    name: input.mac_addr,
                    userId: env.DEMO_USER_ID as string,
                    deviceType: input.type,
                    info: {}
                }
            })
            return "device added"
        }),
    nameDevice: publicProcedure
        .input(z.object({ id: MacAddressType, name: z.string() }))
        .mutation(({ input, ctx }) => {
            // const test = await ctx.prisma.device.update({
            //     where: {
            //         id: input.id,
            //     },
            //     data: {
            //         name: input.name
            //     }
            // })
            // console.log(test);
            return "device renamed"
        }),
    deleteDevice: publicProcedure
        .input(z.object({ id: MacAddressType }))
        .mutation(({ input, ctx }) => {
            // await ctx.prisma.log.deleteMany({
            //     where: {
            //         deviceId: input.id
            //     }
            // })

            // await ctx.prisma.device.delete({
            //     where: {
            //         id: input.id
            //     }
            // })
            return "device deleted"
        }),
    deleteDeviceLogs: publicProcedure
        .input(z.object({ deviceId: MacAddressType, datetimeParams: z.string() }))
        // .input(z.object({ deviceId: MacAddressType, datetimeParams: z.string(), dataParams: z.any() }))
        .mutation(({ input, ctx }) => {
            // const { count } = await ctx.prisma.log.deleteMany({
            //     where: {
            //         deviceId: input.deviceId,
            //         datetime: input.datetimeParams,
            //         // data: input.dataParams,
            //     }
            // })
            return `no logs deleted`
        }),
    fetchDeviceLogs: publicProcedure
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
                        userId: env.DEMO_USER_ID as string,
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
    // gets the most recent log from each device in the list
    fetchLatestLogsFromDeviceList: publicProcedure
        .input(z.object({ userId: z.string(), deviceIds: z.array(MacAddressType) }))
        .query(async ({ input, ctx }) => {
            const logs: Log[] = await ctx.prisma.log.findMany({
                where: {
                    deviceId: {
                        in: input.deviceIds,
                    },
                    device: {
                        userId: env.DEMO_USER_ID as string,
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
    fetchLatestLogs: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input, ctx }) => {
            // parse and return the most recent log from each device along with the device name and type
            const devices = await ctx.prisma.device.findMany({
                where: {
                    userId: env.DEMO_USER_ID as string
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
    changeDevicePosition: publicProcedure
        .input(z.object({ id: MacAddressType, x: z.number(), y: z.number() }))
        .mutation(({ input, ctx }) => {
            // await ctx.prisma.device.update({
            //     where: {
            //         id: input.id,
            //     },

            //     data: {
            //         info: {
            //             x: input.x,
            //             y: input.y,
            //         }
            //     }
            // })
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
