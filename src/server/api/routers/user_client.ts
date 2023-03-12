import { z } from "zod";
import { DeviceType, Log } from "@prisma/client";

const DeviceTypeZod: z.ZodType<DeviceType> = z.enum(['MOUNTEDv1', 'PERSONALv1']);

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

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
        .input(z.object({ deviceId: MacAddressType, datetimeParams: z.string() }))
        // .input(z.object({ deviceId: MacAddressType, datetimeParams: z.string(), dataParams: z.any() }))
        .query(async ({ input, ctx }) => {
            const logs: Log[] = await ctx.prisma.log.findMany({
                where: {
                    // deviceId: input.deviceId,
                    // datetime: input.datetimeParams,
                    // data: input.dataParams,
                }
            })
            const parsedLogs = logs.map(log => ({
                datetime: log.datetime,
                deviceId: log.deviceId,
                ...(log.data as object)
            }));
            return parsedLogs
        }),
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
});
