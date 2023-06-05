import { Dispatch, SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { RouterOutputs, api } from "~/utils/api";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function useCreateBoard({ setShowModal }: Props) {
  const utils = api.useContext();

  const { mutate, isLoading } = api.board.create.useMutation({
    onSuccess: (data) => {
      toast.success("Created successfully😊");
      setShowModal(false);
      console.log(data);

      const updateData: Parameters<
        typeof utils.board.getAll.setInfiniteData
      >[1] = (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [
            {
              // ...oldData.pages[0],
              allBoards: [data, ...(oldData.pages[0]?.allBoards || [])],
              nextCursor: oldData.pages[0]?.nextCursor,
            },
            ...oldData.pages.slice(1),
          ],
        };
      };

      utils.board.getAll.setInfiniteData({}, updateData);
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
