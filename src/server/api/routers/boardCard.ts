import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { formatError } from "~/utils/functions";
import { TRPCError } from "@trpc/server";
import cloudinary from "~/utils/cloudinaryConfig";

function authorizedUsers({ loggedInUser }: { loggedInUser: string }) {
  return [
    {
      creator: {
        id: loggedInUser,
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
            OR: authorizedUsers({ loggedInUser: session.user.id }),
          },
          select: {
            id: true,
            title: true,
            description: true,
            cover: true,
            Attachments: true,
            BoardList: {
              select: {
                name: true,
              },
            },
          },
        });

        return details;
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
          if (!updateDescription.count) {
            throw new Error("Not authorized!!!");
          }
          return { description };
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  createAttachment: protectedProcedure
    .input(
      z.object({
        cardID: z.string(),
        fileType: z.string(),
        attachment: z.string(),
        name: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { cardID, fileType, attachment, name },
      }) => {
        try {
          const uploadFile = await cloudinary.uploader.upload(attachment, {
            resource_type: "auto",
          });

          if (
            // fileType === "image" ||
            // fileType === "video" ||
            // fileType === "audio"
            fileType.startsWith("image") ||
            fileType.startsWith("video") ||
            fileType.startsWith("audio")
          ) {
            // Add **fl_attachment** in the URL to be able download the image/audio/video.
            uploadFile.url = uploadFile.url.replace(
              "upload",
              "upload/fl_attachment"
            );

            // * Alternative
            // ? uploadFile.url = uploadFile.url.split("upload").join("upload/fl_attachment")
          }

          const newAttachment = await prisma.attachment.create({
            data: {
              name,
              fileType,
              boardCard: {
                connect: {
                  id: cardID,
                },
              },
              downloadURL: uploadFile.url,
              uploadID: uploadFile.public_id,
            },
            select: {
              id: true,
              name: true,
              fileType: true,
              downloadURL: true,
              createdAt: true,
            },
          });

          return newAttachment;
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
  deleteComment: protectedProcedure
    .input(z.object({ commentID: z.string() }))
    .mutation(async ({ ctx: { prisma, session }, input: { commentID } }) => {
      try {
        const deleteComment = await prisma.comment.deleteMany({
          where: {
            id: commentID,
            OR: [
              {
                user: {
                  id: session.user.id,
                },
              },
              {
                boardCard: {
                  BoardList: {
                    Board: {
                      user: {
                        id: session.user.id,
                      },
                    },
                  },
                },
              },
            ],
          },
        });

        if (deleteComment.count) {
          return "Successfully deleted";
        } else {
          throw new Error("Server error. Please try again later");
        }
      } catch (err) {
        console.log(err);
        throw new TRPCError(formatError(err));
      }
    }),
  updateComment: protectedProcedure
    .input(z.object({ commentID: z.string(), content: z.string() }))
    .mutation(
      async ({ ctx: { prisma, session }, input: { commentID, content } }) => {
        try {
          const updateComment = await prisma.comment.updateMany({
            where: {
              id: commentID,
              user: {
                id: session.user.id,
              },
            },
            data: {
              content,
            },
          });

          if (updateComment.count) {
            return "Successfully updated";
          } else {
            throw new Error("Server error. Please try again later");
          }
        } catch (err) {
          console.log(err);
          throw new TRPCError(formatError(err));
        }
      }
    ),
  // createLabel: protectedProcedure.input(z.object({name: z.string(), labelColor: z.string(), cardID: z.string()})).mutation(async ({ctx: {prisma,session}, input: {name, labelColor, cardID}}) => {
  //   try{
  //     const newLabel = await prisma.label.create()
  //   }catch(err){
  //     console.log(err);
  //     throw new TRPCError(formatError(err));
  //   }
  // })
});
