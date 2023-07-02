import { z } from "zod";

export const CreateBoardInput = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
  image: z.string().min(1, { message: "Cover is required" }),
});

export type CreateBoardInputType = z.infer<typeof CreateBoardInput>;

export const RegisterUser = z.object({
  name: z.coerce
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.coerce
    .string({ required_error: "Password is required" })
    .min(4, { message: "Password must be at least 4 characters long" }),
  image: z.string().optional(),
});

export type RegisterUserType = z.infer<typeof RegisterUser>;

export const LoginUser = RegisterUser.pick({ email: true, password: true });
export type LoginUserType = z.infer<typeof LoginUser>;
