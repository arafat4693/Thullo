import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { LoginUser } from "~/utils/zodSchemas";

interface Props {
  setUserForm: Dispatch<SetStateAction<"Login" | "Register">>;
}

export default function LoginForm({ setUserForm }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginUser),
  });

  function onSubmit(data: FieldValues) {
    console.log(data);
    signIn("credentials", { email: data.email, password: data.password });
  }

  return (
    <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-center text-xl font-semibold text-gray-600">Login</h3>
      <TextInput
        {...register("email")}
        type="email"
        placeholder="Email"
        color="info"
      />
      {errors.email?.message && (
        <Alert color="failure">
          <p>{errors.email.message.toString()}</p>
        </Alert>
      )}

      <TextInput
        {...register("password")}
        type="password"
        placeholder="Password"
        color="info"
      />
      {errors.password?.message && (
        <Alert color="failure">
          <p>{errors.password.message.toString()}</p>
        </Alert>
      )}

      <Button type="submit">Login</Button>
      <p className="text-sm font-medium text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-blue-500 underline"
          onClick={() => setUserForm("Register")}
        >
          Register
        </button>
      </p>
    </form>
  );
}
