import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { formatError } from "~/utils/functions";

export const memberRouter = createTRPCRouter({
  addBoardMember: protectedProcedure
    .input(
      z.object({
        memberID: z.string(),
        boardID: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { memberID, boardID } }) => {
        try {
          await prisma.board.findFirstOrThrow({
            where: {
              id: boardID,
              user: {
                id: session.user.id,
              },
            },
          });

          await prisma.board.update({
            where: {
              id: boardID,
            },
            data: {
              members: {
                connect: {
                  id: memberID,
                },
              },
            },
          });

          return { memberID };
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  addCardMember: protectedProcedure
    .input(
      z.object({
        memberID: z.string(),
        cardID: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { memberID, cardID } }) => {
        try {
          await prisma.boardCard.findFirstOrThrow({
            where: {
              id: cardID,
              OR: [
                {
                  BoardList: {
                    Board: {
                      user: {
                        id: session.user.id,
                      },
                    },
                  },
                },
                {
                  creator: {
                    id: session.user.id,
                  },
                },
              ],
            },
          });

          await prisma.boardCard.update({
            where: {
              id: cardID,
            },
            data: {
              assignedMembers: {
                connect: {
                  id: memberID,
                },
              },
            },
          });

          return { memberID };
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  getBoardMembers: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.string().optional(),
        boardID: z.string(),
        searchKey: z.string(),
      })
    )
    .query(
      async ({
        ctx: { prisma },
        input: { limit = 5, cursor, boardID, searchKey },
      }) => {
        try {
          const users = await prisma.user.findMany({
            take: limit + 1,
            cursor: cursor === undefined ? undefined : { id: cursor },
            where: {
              boardsMember: {
                some: {
                  id: boardID,
                },
              },
              name: {
                contains: searchKey,
                mode: "insensitive",
              },
            },
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
              image: true,
            },
          });

          let nextCursor: typeof cursor = undefined;

          if (users.length > limit) {
            const lastUser = users.pop();
            nextCursor = lastUser?.id;
          }

          return { users, nextCursor };
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  // searchBoardMembers: protectedProcedure
  //   .input(z.object({ keyWord: z.string() }))
  //   .mutation(async ({ ctx: { prisma }, input: { keyWord } }) => {
  //     try {
  //       const users = await prisma.user.findMany({
  //         where: {
  //           name: {
  //             contains: keyWord,
  //             mode: "insensitive",
  //           },
  //         },
  //         orderBy: {
  //           name: "asc",
  //         },
  //         select: {
  //           id: true,
  //           name: true,
  //           image: true,
  //         },
  //       });

  //       return users;
  //     } catch (err) {
  //       console.log(err);
  //       throw new TRPCError(formatError(err));
  //     }
  //   }),
});
