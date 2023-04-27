import { Button } from "flowbite-react";
import { CgProfile } from "react-icons/cg";
import Labels from "./Labels";

export default function ActionInModal() {
  return (
    <aside className="ActionInModal">
      <p className="flex items-center gap-2 text-sm font-medium text-gray-400">
        <CgProfile />
        Actions
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <Button color="dark">Members</Button>
        <Labels />
        <Button color="dark">Covers</Button>
      </div>
    </aside>
  );
}
