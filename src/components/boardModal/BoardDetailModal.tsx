import { Button } from "flowbite-react";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
import ActionInModal from "./ActionInModal";
import DetailsInModal from "./DetailsInModal";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function BoardDetailModal({ setShowModal }: Props) {
  return (
    <div
      className="styledScrollbarY max-h-[96%] w-[43rem] rounded-lg bg-white p-5 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <figure className="relative h-36 w-full rounded-xl">
        <Button
          size="xs"
          className="absolute -right-2 -top-3 z-10"
          onClick={(e) => setShowModal(false)}
        >
          <AiOutlineClose className="h-5 w-5" />
        </Button>
        <Image
          className="h-full w-full rounded-lg object-cover"
          fill
          alt="Meaningful alt text for an image that is not purely decorative"
          src="https://flowbite.com/docs/images/blog/image-1.jpg"
        />
      </figure>

      <main className="mt-6 grid grid-cols-3 gap-6">
        <DetailsInModal />
        <ActionInModal />
      </main>
    </div>
  );
}
