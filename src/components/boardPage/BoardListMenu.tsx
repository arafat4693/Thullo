import { Dropdown } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";
import { api } from "~/utils/api";

interface Props {
  setRename: Dispatch<SetStateAction<boolean>>;
  listID: string;
  boardID: string;
}

export default function BoardListMenu({ setRename, listID, boardID }: Props) {
  const utils = api.useContext();

  const { mutate, isLoading } = api.board.deleteList.useMutation({
    onSuccess: () => {
      toast.success("Deleted Successfully.");
      utils.board.getSingle.setData({ boardID }, (old) => {
        if (old === undefined) return old;
        return {
          ...old,
          boardLists: [...old.boardLists.filter((l) => l.id !== listID)],
        };
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={<BsThreeDots className="cursor-pointer" />}
      className="min-w-[9.5rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <p
        className={`cursor-pointer border-0 border-b border-solid border-gray-200 pb-2.5 pt-1.5 text-sm text-gray-500 transition-all hover:text-red-600 ${
          isLoading ? "pointer-events-none" : "pointer-events-auto"
        }`}
        onClick={() => setRename(true)}
      >
        Rename
      </p>

      <p
        onClick={() => mutate({ listID })}
        className={`cursor-pointer pb-1.5 pt-2.5 text-sm text-gray-500 transition-all hover:text-red-600 ${
          isLoading ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {isLoading ? "Deleting" : "Delete this list"}
      </p>
    </Dropdown>
  );
}
