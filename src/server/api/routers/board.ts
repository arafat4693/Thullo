import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import cloudinary from "~/utils/cloudinaryConfig";
import { formatError } from "~/utils/functions";
import { CreateBoardInput } from "~/utils/zodSchemas";

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
              members: {
                where: {
                  id: {
                    not: session.user.id,
                  },
                },
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
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
          select: {
            id: true,
            title: true,
            cover: true,
            members: {
              where: {
                id: {
                  not: ctx.session.user.id,
                },
              },
              select: {
                id: true,
                name: true,
                image: true,
              },
              take: 3,
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        });

        let nextCursor: typeof cursor | undefined;

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
});
