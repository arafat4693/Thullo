import { createTRPCRouter, publicProcedure } from "../trpc";
import { formatError } from "~/utils/functions";
import { TRPCError } from "@trpc/server";
import { RegisterUser } from "~/utils/zodSchemas";
import bcrypt from "bcrypt";
import cloudinary from "~/utils/cloudinaryConfig";

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
});
