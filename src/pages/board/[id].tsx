import { Avatar, Button } from "flowbite-react";
import { AiFillLock, AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import AssignMember from "~/components/boardModal/AssignMember";
import BoardList from "~/components/boardPage/BoardList";
import Visibility from "~/components/boardPage/Visibility";
import MyButton from "~/components/layout/MyButton";

export default function board() {
  return (
    <section className="mt-4 w-full bg-white">
      <main className="mx-auto w-[92rem] max-w-full p-3">
        <nav className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Visibility />
            <Avatar
              size="sm"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            />

            <Avatar
              size="sm"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            />

            <AssignMember
              title="Invite to Board"
              subtitle="Search users you want to invite to"
              btnName="Invite"
              labelElm={
                <p className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-blue-600 text-xl text-white hover:bg-blue-700">
                  <AiOutlinePlus />
                </p>
              }
            />
          </div>

          <MyButton BtnIcon={BsThreeDots} btnName="Show Menu" />
        </nav>

        {/*have to fix the scrollbar*/}
        <article className="styledScrollbarX mt-5 flex gap-x-8 rounded-xl bg-sky-100/60 p-4">
          <BoardList />
          <BoardList />
          <BoardList />
          <BoardList />
          <BoardList />
          <BoardList />
        </article>
      </main>
    </section>
  );
}
