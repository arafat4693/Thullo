import { Button } from "flowbite-react";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import Attachment from "./Attachment";

export default function DetailsInModal() {
  return (
    <div className="col-span-2">
      <h1 className="text-base font-semibold text-gray-800">
        🐼 Move anything that is actually started here
      </h1>

      <p className="mt-1.5 text-xs font-medium text-gray-400">
        In list <span className="font-semibold text-gray-800">In Progress</span>
      </p>

      <div className="mt-6 flex items-center gap-3">
        <p className="flex items-center gap-x-1 text-xs font-medium text-gray-400">
          <HiDocumentText />
          Description
        </p>
        <Button color="dark" pill={true} size="xs">
          <AiFillEdit className="mr-1 h-3 w-3" />
          Edit
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <p className="flex items-center gap-x-1 text-xs font-medium text-gray-400">
          <HiDocumentText />
          Attachments
        </p>
        <Button color="dark" pill={true} size="xs">
          <AiOutlinePlus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>

      <Attachment />
      <Attachment />
    </div>
  );
}
