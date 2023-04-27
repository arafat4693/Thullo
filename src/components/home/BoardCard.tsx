import { Avatar } from "flowbite-react";
import Image from "next/image";

export default function BoardCard() {
  return (
    <div className="rounded-xl bg-white p-3 shadow-md">
      <figure className="relative h-36 w-full rounded-xl">
        <Image
          className="h-full w-full rounded-xl object-cover"
          fill
          alt="Meaningful alt text for an image that is not purely decorative"
          src="https://flowbite.com/docs/images/blog/image-1.jpg"
        />
      </figure>
      <h5 className="my-2.5 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        Noteworthy technology
      </h5>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Avatar
          size="sm"
          img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        />
        <Avatar
          size="sm"
          img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        />
        <Avatar
          size="sm"
          img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        />
        <span className="text-sm font-medium text-gray-400">+ 5 others</span>
      </div>
    </div>
  );
}
