import { Button, Spinner } from "flowbite-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  BsFiletypeDoc,
  BsFillCameraVideoFill,
  BsMusicNoteBeamed,
} from "react-icons/bs";
import { RouterOutputs, api } from "~/utils/api";
import { formatDate } from "~/utils/functions";

interface Props {
  attachment: RouterOutputs["boardCard"]["getDetails"]["Attachments"][number];
  cardID: string;
}

export default function Attachment({ attachment, cardID }: Props) {
  const utils = api.useContext();
  const { mutate: deleteAttachment, isLoading: deletingAttachment } =
    api.boardCard.deleteAttachment.useMutation({
      onSuccess: (data, { attachmentID }) => {
        toast.success(data);
        utils.boardCard.getDetails.setData({ cardID }, (old) => {
          if (old === undefined) return old;
          return {
            ...old,
            Attachments: [
              ...old.Attachments.filter((a) => a.id !== attachmentID),
            ],
          };
        });
      },
      onError: (err) => {
        toast.error("Server error: Please try again later.");
        console.log(err);
      },
    });

  function attachmentDelete() {
    deleteAttachment({
      attachmentID: attachment.id,
      uploadID: attachment.uploadID,
      fileType: attachment.fileType,
    });
  }

  return (
    <div className="mt-3.5 flex items-center gap-3">
      {attachment.fileType.startsWith("image") ? (
        <figure className="relative h-14 w-20">
          <Image
            src={attachment.downloadURL}
            alt="attachment"
            fill
            className="rounded-lg object-cover"
          />
        </figure>
      ) : (
        <div
          className={`flex h-14 w-20 items-center justify-center rounded-lg ${
            attachment.fileType.startsWith("audio")
              ? "bg-orange-300"
              : attachment.fileType.startsWith("video")
              ? "bg-lime-300"
              : "bg-gray-300"
          }`}
        >
          {attachment.fileType.startsWith("audio") ? (
            <BsMusicNoteBeamed className="h-6 w-6 text-orange-500" />
          ) : attachment.fileType.startsWith("video") ? (
            <BsFillCameraVideoFill className="h-6 w-6 text-lime-500" />
          ) : (
            <BsFiletypeDoc className="h-6 w-6 text-gray-500" />
          )}
        </div>
      )}

      <div>
        <span className="text-xs text-gray-400">
          Added {formatDate(attachment.createdAt as unknown as string)}
        </span>
        <h3 className="text-sm font-bold text-gray-800">{attachment.name}</h3>
        <div className="mt-1.5 flex flex-wrap gap-2">
          <a href={attachment.downloadURL} download>
            <Button disabled={deletingAttachment} color="success" size="xs">
              Download
            </Button>
          </a>
          <Button
            onClick={attachmentDelete}
            disabled={deletingAttachment}
            color="failure"
            size="xs"
          >
            {deletingAttachment ? <Spinner size="sm" light={true} /> : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
