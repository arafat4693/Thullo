import { CgProfile } from "react-icons/cg";
import Covers from "./Covers";
import Labels from "./Labels";
import Members from "./Members";

export default function ActionInModal() {
  return (
    <aside className="ActionInModal">
      <p className="flex items-center gap-2 text-sm font-medium text-gray-400">
        <CgProfile />
        Actions
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <Labels />
        <Covers />
        <Members />
      </div>
    </aside>
  );
}
