import { Button } from "flowbite-react";
import { signIn } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function LoginModal({ setShowModal }: Props) {
  return (
    <div
      className="w-96 rounded-lg bg-white p-5 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
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
