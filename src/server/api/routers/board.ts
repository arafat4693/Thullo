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
                select: {
                  id: true,
                  name: true,
                  image: true,
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
});
