import { Alert, Button, Spinner } from "flowbite-react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { shallow } from "zustand/shallow";
import { useCardDetailsModal } from "~/hooks/use-card-modal";
import { api } from "~/utils/api";
import ActionInModal from "./ActionInModal";
import DetailsInModal from "./DetailsInModal";

export default function BoardDetailModal() {
  const [cardID, onClose] = useCardDetailsModal(
    (state) => [state.cardID, state.onClose],
    shallow
  );

  const {
    data: cardDetails,
    isLoading,
    error,
  } = api.boardCard.getDetails.useQuery(
    {
      cardID,
    },
    {
      enabled: !!cardID,
    }
  );

  if (!cardID) {
    onClose();
    return null;
  }

  if (error || cardDetails === undefined || isLoading) {
    error && console.log(error);
    return (
      <section
        onClick={() => onClose()}
        className="modal fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-gray-300/70"
      >
        <div
          className="w-[43rem] rounded-lg bg-white p-5 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner size="md" light={true} />
            </div>
          ) : (
            <Alert color="failure">
              <span>
                <span className="font-medium">Something went wrong!</span>{" "}
                Please try again later!!!
              </span>
            </Alert>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      onClick={() => onClose()}
      className="modal fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-gray-300/70"
    >
      <div
        className="styledScrollbarY max-h-[96%] w-[43rem] rounded-lg bg-white p-5 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <figure className="relative h-36 w-full rounded-xl">
          <Button
            size="xs"
            className="absolute -right-2 -top-3 z-10"
            onClick={(e) => onClose()}
          >
            <AiOutlineClose className="h-5 w-5" />
          </Button>
          <Image
            className="h-full w-full rounded-lg object-cover"
            fill
            alt="Meaningful alt text for an image that is not purely decorative"
            src="https://flowbite.com/docs/images/blog/image-1.jpg"
          />
        </figure>

        <main className="mt-6 grid grid-cols-3 gap-6">
          <DetailsInModal cardDetails={cardDetails} />
          <ActionInModal />
        </main>
      </div>
    </section>
  );
}
