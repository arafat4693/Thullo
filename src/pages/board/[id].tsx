import { Avatar, Button } from "flowbite-react";
import { AiFillLock, AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
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

            <Button size="sm">
              <AiOutlinePlus />
            </Button>
          </div>

          <MyButton BtnIcon={BsThreeDots} btnName="Show Menu" />
        </nav>

        <article className="mt-5 w-full rounded-xl bg-sky-100/60 p-4">
          <BoardList />
        </article>
      </main>
    </section>
  );
}
