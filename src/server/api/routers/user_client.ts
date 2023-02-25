import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const deviceClientRouter = createTRPCRouter({
//   post: publicProcedure
//     .input(z.object({ id: z.string(), posts: z.array(z.object({
//       // datetime: z.date(),
//       datetime: z.string(),
//       data: z.object({
//         air_quality: z.optional(z.number()),
//         co2: z.optional(z.number()),
//         co: z.optional(z.number()),
//         temperature: z.optional(z.number()),
//         humidity: z.optional(z.number()),
//         vtol: z.optional(z.number()),
//       })
//     }))}))
//     .query(async ({ input, ctx }) => {
//       let device = await ctx.prisma.device.findUnique({
//         where: {
//           id: input.id
//         }
//       })

//       if (!device) {
//         return "device not registered"
//       }

//       let logs = input.posts.map(post => ({
//         deviceId: input.id,
//         datetime: post.datetime,
//         data: post.data,
//       }))

//       ctx.prisma.log.createMany({
//         data: logs
//       })

//       return "success"
//     }),

//   hello: publicProcedure
//     .input(z.object({ text: z.string() }))
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input.text}`,
//       };
//     }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

//   getSecretMessage: protectedProcedure.query(() => {
//     return "you can now see this secret message!";
//   }),
});
