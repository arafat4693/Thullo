import { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

interface Props {
  setCreateListForm: Dispatch<SetStateAction<boolean>>;
}

export default function useCreateBoardList({ setCreateListForm }: Props) {
  const utils = api.useContext();

  const { mutate, isLoading } = api.board.createList.useMutation({
    onSuccess: (data, { boardID }) => {
      toast.success("Created successfully😊");
      setCreateListForm(false);
      utils.board.getSingle.setData({ boardID }, (old) => {
        if (old === undefined) return old;
        return {
          ...old,
          boardLists: [...old.boardLists, data],
        };
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
  return { mutate, isLoading };
}
