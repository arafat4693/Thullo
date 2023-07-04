import { Dropdown } from "flowbite-react";
import { AiFillLock } from "react-icons/ai";
import MyButton from "../layout/MyButton";
import { BsGlobeAmericas } from "react-icons/bs";
import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

interface Props {
  boardVisibility: RouterOutputs["board"]["getSingle"]["visibility"];
}

export default function Visibility({ boardVisibility }: Props) {
  const utils = api.useContext();
  const router = useRouter();

  const { mutate, isLoading } = api.board.updateVisibility.useMutation({
    onSuccess: (data) => {
      utils.board.getSingle.setData(
        { boardID: router.query.id as string },
        (old) => {
          if (old === undefined) return old;
          return { ...old, visibility: data };
        }
      );
      toast.success("Visibility updated!!!");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  function updateVisibility(visibility: "PUBLIC" | "PRIVATE", boardID: string) {
    mutate({ visibility, boardID });
  }

  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={
        <p className="flex items-center gap-2 rounded-lg bg-[#F2F2F2] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#e7e7e7]">
          {boardVisibility === "PRIVATE" ? (
            <>
              <AiFillLock />
              Private
            </>
          ) : (
            <>
              <BsGlobeAmericas />
              Public
            </>
          )}
        </p>
      }
      className="min-w-[16rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <h4 className="text-sm font-semibold text-gray-700">Visibility</h4>
      <p className="mt-0.5 text-sm text-gray-400">
        Choose who can see to this board.
      </p>

      <div
        className={`mt-3 cursor-pointer rounded-lg p-2.5 transition-all ${
          boardVisibility === "PUBLIC" ? "bg-gray-100" : "hover:bg-gray-100"
        } ${isLoading ? "pointer-events-none" : "pointer-events-auto"}`}
        onClick={() => updateVisibility("PUBLIC", router.query.id as string)}
      >
        <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-600">
          <BsGlobeAmericas />
          Public
        </div>
        <p className="text-xs text-gray-400">
          Anyone on the internet can see this
        </p>
      </div>

      <div
        className={`mt-3 cursor-pointer rounded-lg p-2.5 transition-all ${
          boardVisibility === "PRIVATE" ? "bg-gray-100" : "hover:bg-gray-100"
        } ${isLoading ? "pointer-events-none" : "pointer-events-auto"}`}
        onClick={() => updateVisibility("PRIVATE", router.query.id as string)}
      >
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
