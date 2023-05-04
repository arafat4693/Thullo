import { BsThreeDots } from "react-icons/bs";
import BoardListMenu from "./BoardListMenu";

export default function BoardList() {
  return (
    <div className="w-64">
      <header className="flex items-center justify-between text-sm font-semibold text-gray-700">
        Backlog <BoardListMenu />
      </header>

      <section className="mt-4 flex flex-col gap-3">
        <div className="rounded-xl bg-white px-4 py-2 shadow-md">
          <h3 className="text-base font-semibold text-gray-700">
            Add what you'd like to work on below
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
              Technical
            </span>
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
              Technical
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
