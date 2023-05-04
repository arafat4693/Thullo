import { Dropdown } from "flowbite-react";
import { AiFillLock } from "react-icons/ai";
import MyButton from "../layout/MyButton";
import { BsGlobeAmericas } from "react-icons/bs";

export default function Visibility() {
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={
        <p className="flex items-center gap-2 rounded-lg bg-[#F2F2F2] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#e7e7e7]">
          <AiFillLock />
          Private
        </p>
      }
      className="min-w-[16rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <h4 className="text-sm font-semibold text-gray-700">Visibility</h4>
      <p className="mt-0.5 text-sm text-gray-400">
        Choose who can see to this board.
      </p>

      <div className="mt-3 cursor-pointer rounded-lg p-2.5 transition-all hover:bg-gray-100">
        <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-600">
          <BsGlobeAmericas />
          Public
        </div>
        <p className="text-xs text-gray-400">
          Anyone on the internet can see this
        </p>
      </div>

      <div className="mt-3 cursor-pointer rounded-lg p-2.5 transition-all hover:bg-gray-100">
        <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-600">
          <AiFillLock />
          Private
        </div>
        <p className="text-xs text-gray-400">
          Anyone on the internet can see this
        </p>
      </div>
    </Dropdown>
  );
}
