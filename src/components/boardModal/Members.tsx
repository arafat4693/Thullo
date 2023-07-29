import { BsFillPeopleFill } from "react-icons/bs";
import ActionBtn from "./ActionBtn";
import { Avatar } from "flowbite-react";
import { AiOutlinePlus } from "react-icons/ai";
import AssignMember from "./AssignMember";

export default function Members() {
  return (
    <div>
      <ActionBtn btnName="Members" BtnIcon={BsFillPeopleFill} />

      <figure className="mt-3 flex items-center gap-x-3">
        <Avatar
          size="sm"
          img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        />
        <figcaption className="text-sm font-bold text-gray-700">
          Bianca Sosa
        </figcaption>
      </figure>

      <figure className="mt-3 flex items-center gap-x-3">
        <Avatar
          size="sm"
          img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        />
        <figcaption className="text-sm font-bold text-gray-700">
          Bianca Sosa
        </figcaption>
      </figure>

      {/* <AssignMember
        title="Members"
        subtitle="Assign members to this card"
        btnName="Add"
        labelElm={
          <p className="mt-6 flex w-full items-center justify-between rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-500">
            Assign a member
            <AiOutlinePlus className="h-4 w-4" />
          </p>
        }
      /> */}
    </div>
  );
}
