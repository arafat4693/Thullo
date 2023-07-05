import { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

interface Props {
  setCreateListForm: Dispatch<SetStateAction<boolean>>;
}

export default function useCreateBoardList({ setCreateListForm }: Props) {
  const { mutate, isLoading } = api.board.createList.useMutation({
    onSuccess: (data) => {
      toast.success("Created successfully😊");
      setCreateListForm(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
  return { mutate, isLoading };
}
