import { Button } from "flowbite-react";

export default function Attachment() {
  return (
    <div className="mt-3.5 flex items-center gap-3">
      <img
        src="https://flowbite.com/docs/images/blog/image-2.jpg"
        alt="beach"
        className="h-14 w-20 rounded-lg object-cover"
      />

      <div>
        <span className="text-xs text-gray-400">Added July 5, 2023</span>
        <h3 className="text-sm font-bold text-gray-800">
          Lorem ipsum dolor sit
        </h3>
        <div className="mt-1.5 flex flex-wrap gap-2">
          <Button color="success" pill={true} size="xs">
            Download
          </Button>
          <Button color="failure" pill={true} size="xs">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
