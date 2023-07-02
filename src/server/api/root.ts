import { createTRPCRouter } from "~/server/api/trpc";
import { boardRouter } from "~/server/api/routers/board";
import { memberRouter } from "./routers/member";
import { userRouter } from "./routers/user";
import { boardCardRouter } from "./routers/boardCard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: boardRouter,
  member: memberRouter,
  user: userRouter,
  boardCard: boardCardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
