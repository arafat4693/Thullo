import { Button, Dropdown, TextInput } from "flowbite-react";
import { MdLabel } from "react-icons/md";
import ActionBtn from "./ActionBtn";

export default function Labels() {
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={<ActionBtn btnName="Labels" BtnIcon={MdLabel} />}
      className="min-w-[16rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <h4 className="text-sm font-semibold text-gray-700">Label</h4>
      <p className="mt-0.5 text-sm text-gray-400">Select a name and a color</p>

      <TextInput
        type="text"
        placeholder="label..."
        required={true}
        className="my-3 rounded-lg shadow-md"
      />

      <div className="grid grid-cols-4 gap-2">
        <span className="h-7 w-full cursor-pointer rounded-md bg-green-500"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-yellow-400"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-orange-400"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-red-500"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-blue-500"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-sky-400"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-lime-400"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-gray-700"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-gray-600"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-gray-500"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-gray-400"></span>
        <span className="h-7 w-full cursor-pointer rounded-md bg-gray-300"></span>
      </div>

      <p className="mt-3.5 flex items-center gap-x-2 text-sm font-medium text-gray-400">
        <MdLabel />
        Available
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
          Technical
        </span>
      </div>

      <Button className="mx-auto mt-5">Add</Button>
    </Dropdown>
  );
}
