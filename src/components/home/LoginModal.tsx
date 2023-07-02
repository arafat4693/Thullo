import { Button } from "flowbite-react";
import { signIn, useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function LoginModal({ setShowModal }: Props) {
  const [userForm, setUserForm] = useState<"Login" | "Register">("Login");
  const [parent] = useAutoAnimate();

  const userSession = useSession();

  console.log(userSession);

  return (
    <div
      className="max-h-[96%] w-96 overflow-y-scroll rounded-lg bg-white p-5 shadow-sm scrollbar scrollbar-w-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div ref={parent}>
        {userForm === "Login" && <LoginForm setUserForm={setUserForm} />}
        {userForm === "Register" && <RegisterForm setUserForm={setUserForm} />}
      </div>

      <p className="my-2 text-center text-lg font-medium text-gray-600">or</p>

      <Button
        onClick={() => void signIn("google")}
        color="failure"
        className="mb-2 w-full"
      >
        Google
      </Button>
      <Button
        className="w-full"
        color="purple"
        onClick={() => void signIn("discord")}
      >
        Discord
      </Button>
    </div>
  );
}
