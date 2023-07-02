import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { formatError } from "~/utils/functions";
import { TRPCError } from "@trpc/server";

function authorizedUsers({ loggedInUser }: { loggedInUser: string }) {
  return [
    {
      assignedMembers: {
        some: {
          id: loggedInUser,
        },
      },
    },
    {
      BoardList: {
        Board: {
          user: {
            id: loggedInUser,
          },
        },
      },
    },
  ];
}

export const boardCardRouter = createTRPCRouter({
  getDetails: protectedProcedure
    .input(z.object({ cardID: z.string() }))
    .query(async ({ ctx: { prisma, session }, input: { cardID } }) => {
      try {
        const details = await prisma.boardCard.findFirstOrThrow({
          where: {
            id: cardID,
          },
          select: {
            id: true,
            title: true,
            description: true,
            cover: true,
          },
        });
      } catch (err) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),
  updateDescription: protectedProcedure
    .input(z.object({ cardID: z.string(), description: z.string() }))
    .mutation(
      async ({ ctx: { prisma, session }, input: { cardID, description } }) => {
        try {
          const updateDescription = await prisma.boardCard.updateMany({
            where: {
              id: cardID,
              OR: authorizedUsers({ loggedInUser: session.user.id }),
            },
            data: {
              description,
            },
          });

          return { description };
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  createComment: protectedProcedure
    .input(z.object({ cardID: z.string(), content: z.string() }))
    .mutation(
      async ({ ctx: { prisma, session }, input: { cardID, content } }) => {
        try {
          const newComment = await prisma.comment.create({
            data: {
              boardCard: {
                connect: {
                  id: cardID,
                },
              },
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              content,
            },
            select: {
              id: true,
              content: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          });

          return newComment;
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
});
