import { Label } from "@prisma/client";
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

interface DefaultCardValuesType {
  Labels: Label[];
  cover: string | null;
  assignedMembers: {
    id: string;
    name: string | null;
    image: string | null;
  }[];
  _count: {
    Comments: number;
    Attachments: number;
    assignedMembers: number;
  };
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
  deleteBoard: protectedProcedure
    .input(z.object({ boardID: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { boardID } }) => {
      try {
        const deleteBoard = await prisma.board.deleteMany({
          where: {
            id: boardID,
            user: {
              id: session.user.id,
            },
          },
        });

        if (deleteBoard.count) {
          return "Successfully Deleted";
        } else {
          throw new Error("Server Error. Please try again later");
        }
      } catch (err) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),
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
                    creator: {
                      select: {
                        id: true,
                      },
                    },
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
          const cards: (DefaultCardValuesType & {
            id: string;
            title: string;
            creator: { id: string };
          })[] = [];

          return { ...newList, cards };
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  renameBoardList: protectedProcedure
    .input(z.object({ boardListID: z.string(), newName: z.string() }))
    .mutation(
      async ({ ctx: { prisma, session }, input: { boardListID, newName } }) => {
        try {
          const renameList = await prisma.boardList.updateMany({
            where: {
              id: boardListID,
              Board: {
                members: {
                  some: {
                    id: session.user.id,
                  },
                },
              },
            },
            data: {
              name: newName,
            },
          });

          if (!renameList.count) {
            throw new Error("Internal error");
          }

          return newName;
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  deleteList: protectedProcedure
    .input(z.object({ listID: z.string() }))
    .mutation(async ({ ctx: { session, prisma }, input: { listID } }) => {
      try {
        const deleteList = await prisma.boardList.deleteMany({
          where: {
            id: listID,
            Board: {
              members: {
                some: {
                  id: session.user.id,
                },
              },
            },
          },
        });

        if (!deleteList.count) {
          throw new Error("Internal error");
        }
        return listID;
      } catch (err) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),
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
              creator: {
                select: {
                  id: true,
                },
              },
            },
          });

          const defaultCardValues: DefaultCardValuesType = {
            Labels: [],
            cover: null,
            assignedMembers: [],
            _count: {
              Comments: 0,
              Attachments: 0,
              assignedMembers: 0,
            },
          };

          return { ...newCard, ...defaultCardValues };
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
