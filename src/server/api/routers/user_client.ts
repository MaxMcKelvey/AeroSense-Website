import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const MacAddressType = z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/);

export const userClientRouter = createTRPCRouter({
    registerDevice: protectedProcedure
        .input(z.object({ mac_addr: MacAddressType, account: z.string() }))
        .query(({ input, ctx }) => {
            ctx.prisma.device.create({
                data: {
                    id: input.mac_addr,
                    accountId: input.account,
                }
            })
            return "device added"
        }),
    nameDevice: protectedProcedure
        .input(z.object({ id: MacAddressType, name: z.string() }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.device.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name
                }
            })
            return "device renamed"
        }),
    deleteDevice: protectedProcedure
        .input(z.object({ id: MacAddressType }))
        .query(async ({ input, ctx }) => {
            await ctx.prisma.device.delete({
                where: {
                    id: input.id
                }
            })
            return "device deleted"
        }),
    transferDevice: protectedProcedure
        .input(z.object({ id: MacAddressType, newAccountId: z.string() }))
        .query(async ({ input, ctx }) => {
            let newAccount = await ctx.prisma.account.findUnique({
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
                    accountId: input.newAccountId
                }
            })
            return "device transferred"
        }),
    deleteDeviceLogs: protectedProcedure
        .input(z.object({ deviceId: MacAddressType, datetimeParams: z.any(), dataParams: z.any() }))
        .query(async ({ input, ctx }) => {
            const { count } = await ctx.prisma.log.deleteMany({
                where: {
                    deviceId: input.deviceId,
                    datetime: input.datetimeParams,
                    data: input.dataParams,
                }
            })
            return `${count} logs deleted`
        }),
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
});
