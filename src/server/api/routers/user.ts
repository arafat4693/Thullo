import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { formatError } from "~/utils/functions";
import { TRPCError } from "@trpc/server";
import { RegisterUser } from "~/utils/zodSchemas";
import bcrypt from "bcrypt";
import cloudinary from "~/utils/cloudinaryConfig";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterUser)
    .mutation(async ({ ctx: { prisma }, input }) => {
      try {
        const { name, email, password, image } = input;

        const isUser = await prisma.user.count({
          where: {
            email,
          },
        });

        if (isUser) {
          throw new Error("User already exists!");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt) as string;

        let userImage;

        if (image) {
          userImage = await cloudinary.uploader.upload(image);
        }

        await prisma.user.create({
          data: {
            name,
            email,
            image: userImage?.url,
            imageID: userImage?.public_id,
            hashedPassword,
          },
        });

        return { message: "Successfully registered" };
      } catch (err: any) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),
  getUsers: protectedProcedure
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
        input: { boardID, limit = 3, cursor, searchKey },
      }) => {
        try {
          const members = await prisma.board.findUniqueOrThrow({
            where: {
              id: boardID,
            },
            select: {
              memberIDs: true,
            },
          });

          const users = await prisma.user.findMany({
            take: limit + 1,
            cursor: cursor === undefined ? undefined : { id: cursor },
            where: {
              id: {
                notIn: members.memberIDs,
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
        } catch (err: any) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
});
