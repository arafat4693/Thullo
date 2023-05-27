import { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function useCreateBoard({ setShowModal }: Props) {
  const { mutate, isLoading } = api.board.create.useMutation({
    onSuccess: (data) => {
      toast.success("Created successfully😊");
      setShowModal(false);
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
      err.message.includes('"Body excee"... is not valid JSON')
        ? toast.error("Image's size is too big. Max 1MB")
        : toast.error(err.message);
    },
  });
  return { mutate, isLoading };
}
