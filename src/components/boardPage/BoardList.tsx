import { BiMessageDetail } from "react-icons/bi";
import BoardListMenu from "./BoardListMenu";
import { Avatar, Button } from "flowbite-react";
import AssignMember from "../boardModal/AssignMember";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosAttach } from "react-icons/io";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { RouterOutputs } from "~/utils/api";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  boardList: RouterOutputs["board"]["getSingle"]["boardLists"][number];
}

export default function BoardList({ setShowModal, boardList }: Props) {
  return (
    <div className="w-64 shrink-0">
      <header className="flex items-center justify-between text-sm font-semibold text-gray-700">
        {boardList.name} <BoardListMenu />
      </header>

      <section className="mt-4 flex flex-col gap-3">
        <main className="rounded-xl bg-white p-3 shadow-md">
          <figure className="relative h-32 w-full rounded-xl">
            <Image
              src="https://flowbite.com/docs/images/blog/image-1.jpg"
              alt="item cover"
              fill
              className="h-full w-full rounded-xl object-cover"
            />
          </figure>
          <h3
            onClick={() => setShowModal(true)}
            className="mt-4 cursor-pointer text-base font-semibold text-gray-700 hover:underline"
          >
            Add what you'd like to work on below
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
              Technical
            </span>
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
              Technical
            </span>
          </div>

          <footer className="mt-5 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Avatar
                size="xs"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              />

              <Avatar
                size="xs"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              />

              {/* <AssignMember
                title="Invite to Board"
                subtitle="Search users you want to invite to"
                btnName="Add"
                labelElm={
                  <p className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-blue-600 text-sm text-white hover:bg-blue-700">
                    <AiOutlinePlus />
                  </p>
                }
              /> */}
            </div>

            <ul className="flex items-center gap-2.5">
              <li className="flex items-center gap-1 text-xs text-gray-400">
                <BiMessageDetail />2
              </li>
              <li className="flex items-center gap-1 text-xs text-gray-400">
                <IoIosAttach />2
              </li>
            </ul>
          </footer>
        </main>

        <main className="rounded-xl bg-white p-3 shadow-md">
          <figure className="relative h-32 w-full rounded-xl">
            <Image
              src="https://flowbite.com/docs/images/blog/image-1.jpg"
              alt="item cover"
              fill
              className="h-full w-full rounded-xl object-cover"
            />
          </figure>
          <h3 className="mt-4 text-base font-semibold text-gray-700">
            Add what you'd like to work on below
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
              Technical
            </span>
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
              Technical
            </span>
          </div>

          <footer className="mt-5 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <Avatar
                size="xs"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              />

              <Avatar
                size="xs"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              />

              <AssignMember
                title="Invite to Board"
                subtitle="Search users you want to invite to"
                btnName="Add"
                labelElm={
                  <p className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-blue-600 text-sm text-white hover:bg-blue-700">
                    <AiOutlinePlus />
                  </p>
                }
              />
            </div>

            <ul className="flex items-center gap-2.5">
              <li className="flex items-center gap-1 text-xs text-gray-400">
                <BiMessageDetail />2
              </li>
              <li className="flex items-center gap-1 text-xs text-gray-400">
                <IoIosAttach />2
              </li>
            </ul>
          </footer>
        </main>
      </section>

      <Button className="mt-5 w-full">Add Another Card</Button>
    </div>
  );
}
