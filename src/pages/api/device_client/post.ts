import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "~/server/db";

const InputType = z.object({ id: z.string(), posts: z.array(z.object({
    datetime: z.string().regex(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
    // unix_time: z.number(),
    data: z.object({
        aq: z.optional(z.number()),
        co2: z.optional(z.number()),
        co: z.optional(z.number()),
        temp: z.optional(z.number()),
        hum: z.optional(z.number()),
        voc: z.optional(z.number()),
        pm25: z.optional(z.number()),
        pm10: z.optional(z.number()),
        pm100: z.optional(z.number()),
    })
}))})

const DateTimeType = z.string().regex(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const input = InputType.safeParse(req.body);

    if (!input.success) {
        res.status(400).json("Bad request");
        console.log(req.body);
        return;
    }

    const device = await prisma.device.findUnique({
        where: {
            id: input.data.id
        }
    })
    
    if (!device) {
        res.status(400).json("device not registered");
        return;
    }

    console.log(input.data.posts);

    const logs = input.data.posts.map(post => ({
        deviceId: input.data.id,
        datetime: new Date(post.datetime),
        data: post.data,
    }))
    
    console.log(logs);

    const { count } = await prisma.log.createMany({
        data: logs
    })

    console.log(count);

    res.status(200).json(`success, ${count} posts posted`);
}
