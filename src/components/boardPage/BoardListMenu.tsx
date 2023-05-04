import { Dropdown } from "flowbite-react";
import { BsThreeDots } from "react-icons/bs";

export default function BoardListMenu() {
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={<BsThreeDots className="cursor-pointer" />}
      className="min-w-[9.5rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <p className="cursor-pointer border-0 border-b border-solid border-gray-200 pb-2.5 pt-1.5 text-sm text-gray-500 transition-all hover:text-red-600">
        Rename
      </p>

      <p className="cursor-pointer pb-1.5 pt-2.5 text-sm text-gray-500 transition-all hover:text-red-600">
        Delete this list
      </p>
    </Dropdown>
  );
}
