import { Alert, Avatar, Button, Spinner, TextInput } from "flowbite-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";
import { AiFillCamera } from "react-icons/ai";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUser, RegisterUserType } from "~/utils/zodSchemas";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface Props {
  setUserForm: Dispatch<SetStateAction<"Login" | "Register">>;
}

export default function RegisterForm({ setUserForm }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  //* modal not closing on clicking outside

  const { mutate: registerUser, isLoading: registeringUser } =
    api.user.register.useMutation({
      onSuccess: (data) => {
        toast.success(data.message);
        setUserForm("Login");
      },
      onError: (err) => {
        console.log(err);
        err.message.includes('"Body excee"... is not valid JSON')
          ? toast.error("Image's size is too big. Max 1MB")
          : toast.error(err.message);
      },
    });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      image: undefined,
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(RegisterUser),
  });

  function handleImageChange(file: File | undefined) {
    if (file === undefined) return;
    const reader = (readFile: File) =>
      new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

    reader(file)
      .then((result: string) =>
        setValue("image", result, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        })
      )
      .catch((err) => console.log(err));
  }

  function onSubmit(data: FieldValues) {
    console.log(data);
    registerUser(data as RegisterUserType);
  }

  return (
    <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-center text-xl font-semibold text-gray-600">
        Register
      </h3>
      <figure
        onClick={() => fileRef.current?.click()}
        className="group relative mx-auto h-20 w-20 cursor-pointer overflow-hidden rounded-full bg-gray-600"
      >
        <figcaption className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-300/70 opacity-0 transition duration-300 group-hover:opacity-100">
          <AiFillCamera className="h-7 w-7 text-gray-600" />
        </figcaption>
        <Image
          fill
          src={
            getValues().image ??
            "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          }
          alt="user"
          className="object-cover"
        />
      </figure>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={(e) =>
          handleImageChange(e.target.files ? e.target.files[0] : undefined)
        }
      />

      <TextInput
        type="text"
        placeholder="Name"
        color="info"
        {...register("name")}
      />
      {errors.name?.message && (
        <Alert color="failure">
          <p>{errors.name.message.toString()}</p>
        </Alert>
      )}

      <TextInput
        type="email"
        placeholder="Email"
        color="info"
        {...register("email")}
      />
      {errors.email?.message && (
        <Alert color="failure">
          <p>{errors.email.message.toString()}</p>
        </Alert>
      )}

      <TextInput
        type="password"
        placeholder="Password"
        color="info"
        {...register("password")}
      />
      {errors.password?.message && (
        <Alert color="failure">
          <p>{errors.password.message.toString()}</p>
        </Alert>
      )}

      <Button
        type="submit"
        className={
          registeringUser ? "pointer-events-none" : "pointer-events-auto"
        }
      >
        {registeringUser ? (
          <>
            <div className="mr-3">
              <Spinner size="sm" light={true} />
            </div>
            Registering...
          </>
        ) : (
          "Register"
        )}
      </Button>
      <p className="text-sm font-medium text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          className="text-blue-500 underline"
          onClick={() => setUserForm("Login")}
        >
          Login
        </button>
      </p>
    </form>
  );
}
