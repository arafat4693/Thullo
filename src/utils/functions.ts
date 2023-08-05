import type { TRPCError } from "@trpc/server";

export function formatError(err: any) {
  const formattedError: TRPCError = {
    name: "TRPCError",
    code: "INTERNAL_SERVER_ERROR",
    message:
      (err.response && err.response.data && err.response.data.message) ||
      err.message ||
      err.toString(),
    cause: err,
  };
  return formattedError;
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
