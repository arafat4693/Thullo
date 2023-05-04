import { Avatar, Button, Dropdown, TextInput } from "flowbite-react";
import { AiOutlinePlus } from "react-icons/ai";

export default function AssignMember() {
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={
        <button className="mt-6 flex w-full items-center justify-between rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-500">
          Assign a member
          <AiOutlinePlus className="h-4 w-4" />
        </button>
      }
      className="min-w-[16rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <h4 className="text-sm font-semibold text-gray-700">Members</h4>
      <p className="mt-0.5 text-sm text-gray-400">
        Assign members to this card
      </p>

      <TextInput
        type="text"
        placeholder="label..."
        required={true}
        className="my-3 rounded-lg shadow-md"
      />

      <div className="styledScrollbar flex max-h-[11.85rem] flex-col gap-3 rounded-lg border border-solid border-gray-300 p-3 shadow-md">
        <figure className="flex cursor-pointer items-center gap-x-3 hover:bg-gray-200">
          <Avatar
            size="sm"
            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          />
          <figcaption className="text-sm font-bold text-gray-700">
            Bianca Sosa
          </figcaption>
        </figure>
      </div>

      <Button className="mx-auto mt-5">Invite</Button>
    </Dropdown>
  );
}
