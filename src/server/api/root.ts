import { createTRPCRouter } from "~/server/api/trpc";
import { dataRouter } from "./routers/data";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  data: dataRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
