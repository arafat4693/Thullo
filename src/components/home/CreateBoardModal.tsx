import { Button, TextInput } from "flowbite-react";
import Image from "next/image";
import {
  AiOutlineClose,
  AiFillLock,
  AiFillFileImage,
  AiOutlinePlus,
} from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function CreateBoardModal({ setShowModal }: Props) {
  return (
    <div
      className="w-80 rounded-lg bg-white p-5 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <figure className="relative h-20 w-full rounded-xl">
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

      <TextInput
        type="text"
        placeholder="Add board title"
        required={true}
        className="mt-3 rounded-lg border border-solid border-gray-300 shadow-md"
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button size="sm" color="dark">
          <AiFillFileImage className="mr-2 h-5 w-5" />
          Cover
        </Button>

        <Button size="sm" color="dark">
          <AiFillLock className="mr-2 h-5 w-5" />
          Private
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button className="text-sm font-semibold text-gray-500">Cancel</button>
        <Button size="sm">
          <AiOutlinePlus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
    </div>
  );
}
