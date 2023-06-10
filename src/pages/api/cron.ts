import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    console.log("cron job started");
    const users = await prisma.user.findMany();
    console.log(users);
    res.status(200).json("cron job done");
}