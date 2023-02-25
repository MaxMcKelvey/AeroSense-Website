import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { deviceClientRouter } from "./routers/device_client";
import { userClientRouter } from "./routers/user_client";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  device_client: deviceClientRouter,
  user_client: userClientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
