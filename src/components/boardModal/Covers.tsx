import { Dropdown, TextInput } from "flowbite-react";
import ActionBtn from "./ActionBtn";
import { IoMdImage } from "react-icons/io";
import Image from "next/image";

export default function Covers() {
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={<ActionBtn btnName="Covers" BtnIcon={IoMdImage} />}
      className="min-w-[16rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <h4 className="text-sm font-semibold text-gray-700">Photo Search</h4>
      <p className="mt-0.5 text-sm text-gray-400">Search Unsplash for photos</p>

      <TextInput
        type="text"
        placeholder="Keywords..."
        required={true}
        className="my-3 rounded-lg shadow-md"
      />

      <main className="grid grid-cols-4 gap-2">
        <figure className="relative h-14 w-full cursor-pointer rounded-md">
          <Image
            className="h-full w-full rounded-md object-cover"
            fill
            alt="Meaningful alt text for an image that is not purely decorative"
            src="https://flowbite.com/docs/images/blog/image-1.jpg"
          />
        </figure>
      </main>
    </Dropdown>
  );
}
