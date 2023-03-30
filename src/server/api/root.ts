import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userClientRouter } from "./routers/user_client";
import { demoClientRouter } from "./routers/demo_client";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user_client: userClientRouter,
  demo_client: demoClientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
