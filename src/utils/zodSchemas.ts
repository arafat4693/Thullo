import { z } from "zod";

export const CreateBoardInput = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
  image: z.string().min(1, { message: "Cover is required" }),
});

export type CreateBoardInputType = z.infer<typeof CreateBoardInput>;
