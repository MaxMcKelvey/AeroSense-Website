import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "~/server/db";

// import {
// //   createTRPCRouter,
//   publicProcedure,
//   // protectedProcedure,
// } from "~/server/api/trpc";

const InputType = z.object({ id: z.string(), posts: z.array(z.object({
    datetime: z.string().regex(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
    data: z.object({
    air_quality: z.optional(z.number()),
    co2: z.optional(z.number()),
    co: z.optional(z.number()),
    temperature: z.optional(z.number()),
    humidity: z.optional(z.number()),
    vtol: z.optional(z.number()),
    })
}))})

const NumType = z.object({ num: z.number()});

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const input = InputType.safeParse(req.body);

    if (!input.success) {
        res.status(400).json("Bad request");
        console.log(req.body);
        return;
    }

    let a = input.data.id;

    let device = await prisma.device.findUnique({
        where: {
            // id: {
            //     equals: input.data.id
            // }
            id: a
        }
    })

    if (!device) {
        // return "device not registered"
        res.status(400).json("device not registered");
    }

    let logs = input.data.posts.map(post => ({
        deviceId: input.data.id,
        datetime: post.datetime,
        data: post.data,
    }))

    prisma.log.createMany({
        data: logs
    })

    res.status(200).json("success");
}

// export const deviceClientRouter = createTRPCRouter({
//   post: publicProcedure
//     .input(z.object({ id: z.string(), posts: z.array(z.object({
//       datetime: z.string().regex(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
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
// });
