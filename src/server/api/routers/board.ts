import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cloudinary from "~/utils/cloudinaryConfig";
import { formatError } from "~/utils/functions";
import { CreateBoardInput } from "~/utils/zodSchemas";

interface MembersManipulationProps {
  currentUserID: string;
  take?: number;
}

function membersManipulation({
  currentUserID,
  take,
}: MembersManipulationProps) {
  return {
    where: {
      id: {
        not: currentUserID,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take,
  };
}

function isMember({ boardID, userID }: { boardID: string; userID: string }) {
  return {
    where: {
      id: boardID,
      members: {
        some: {
          id: userID,
        },
      },
    },
  };
}

function sortAscDesc() {
  const random = Math.random(); // Generate a random number between 0 and 1

  if (random < 0.5) {
    return "asc";
  } else {
    return "desc";
  }
}

export const boardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateBoardInput)
    .mutation(
      async ({
        input: { title, visibility, image },
        ctx: { prisma, session },
      }) => {
        try {
          const coverPhoto = await cloudinary.uploader.upload(image);

          const board = await prisma.board.create({
            data: {
              title,
              visibility,
              cover: coverPhoto.url,
              coverID: coverPhoto.public_id,
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              members: {
                connect: {
                  id: session.user.id,
                },
              },
            },
            select: {
              id: true,
              title: true,
              cover: true,
              members: membersManipulation({ currentUserID: session.user.id }),
              _count: {
                select: {
                  members: true,
                },
              },
            },
          });

          return board;
        } catch (err: any) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  getAll: protectedProcedure
    .input(
      z.object({ limit: z.number().optional(), cursor: z.string().optional() })
    )
    .query(async ({ ctx, input: { limit = 15, cursor } }) => {
      try {
        const allBoards = await ctx.prisma.board.findMany({
          cursor: cursor ? { id: cursor } : undefined,
          take: limit + 1,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            members: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
          select: {
            id: true,
            title: true,
            cover: true,
            members: {
              ...membersManipulation({
                currentUserID: ctx.session.user.id,
                take: 3,
              }),
              orderBy: { name: sortAscDesc() },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        });

        let nextCursor: typeof cursor = undefined;

        if (allBoards.length > limit) {
          const lastItem = allBoards.pop();
          nextCursor = lastItem?.id;
        }

        return { allBoards, nextCursor };
      } catch (err: any) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),

  getSingle: protectedProcedure
    .input(z.object({ boardID: z.string() }))
    .query(async ({ ctx: { prisma, session }, input: { boardID } }) => {
      try {
        const isMemberOfBoard = await prisma.board.count(
          isMember({ boardID, userID: session.user.id })
        );

        const board = await prisma.board.findUniqueOrThrow({
          where: {
            id: boardID,
          },
          select: {
            id: true,
            title: true,
            visibility: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            members: {
              ...membersManipulation({
                currentUserID: session.user.id,
                take: 5,
              }),
              orderBy: { name: sortAscDesc() },
            },
            boardLists: {
              select: {
                id: true,
                name: true,
                cards: {
                  select: {
                    id: true,
                    title: true,
                    Labels: true,
                    cover: true,
                    assignedMembers: {
                      ...membersManipulation({
                        currentUserID: session.user.id,
                        take: 2,
                      }),
                      orderBy: { name: sortAscDesc() },
                    },
                    _count: {
                      select: {
                        Comments: true,
                        Attachments: true,
                        assignedMembers: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return { ...board, isMemberOfBoard: !!isMemberOfBoard };
      } catch (err) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),

  createList: protectedProcedure
    .input(
      z.object({
        boardID: z.string(),
        name: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { boardID, name } }) => {
        try {
          await prisma.board.findFirstOrThrow(
            isMember({ boardID, userID: session.user.id })
          );

          const newList = await prisma.boardList.create({
            data: {
              Board: {
                connect: {
                  id: boardID,
                },
              },
              name,
            },
            select: {
              id: true,
              name: true,
            },
          });

          return newList;
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  // getLists: protectedProcedure.input(z.object({boardID: z.string()})).query(async ({ctx: {prisma, session}, input: {boardID}}) => {
  //   try{
  //     const allLists = await prisma.boardList.findMany({
  //       where: {
  //         Board: {id: boardID}
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //         cards: {

  //         }
  //       }
  //     })
  //   }catch(err){
  //     console.log(err);
  //     throw new TRPCError(formatError(err));
  //   }
  // }),
  createCard: protectedProcedure
    .input(
      z.object({
        listID: z.string(),
        title: z.string(),
        boardID: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { listID, title, boardID },
      }) => {
        try {
          await prisma.board.findFirstOrThrow(
            isMember({ boardID, userID: session.user.id })
          );

          const newCard = await prisma.boardCard.create({
            data: {
              BoardList: {
                connect: {
                  id: listID,
                },
              },
              assignedMembers: {
                connect: {
                  id: session.user.id,
                },
              },
              creator: {
                connect: {
                  id: session.user.id,
                },
              },
              title,
            },
            select: {
              id: true,
              title: true,
            },
          });

          return newCard;
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  updateVisibility: protectedProcedure
    .input(
      z.object({
        visibility: z.enum(["PUBLIC", "PRIVATE"]),
        boardID: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { visibility, boardID } }) => {
        try {
          const updatedBoard = await prisma.board.updateMany({
            where: {
              id: boardID,
              user: {
                id: session.user.id,
              },
            },
            data: {
              visibility,
            },
          });

          if (!updatedBoard.count) {
            throw new Error("Not authorized!!!");
          }

          return visibility;
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
});
