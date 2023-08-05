import { Button, Spinner } from "flowbite-react";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import Attachment from "./Attachment";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import { RouterOutputs, api } from "~/utils/api";
import TextareaAutosize from "react-textarea-autosize";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useCardDetailsModal } from "~/hooks/use-card-modal";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  cardDetails: RouterOutputs["boardCard"]["getDetails"];
}

interface Desc {
  description: string;
}

interface Attachment {
  name: string;
  fileType: string;
  uploadURL: string;
}

export default function DetailsInModal({ cardDetails }: Props) {
  const [seeMoreDesc, setSeeMoreDesc] = useState<boolean>(false);
  const [seeMoreAttachments, setSeeMoreAttachments] = useState<boolean>(false);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<boolean>(false);
  const [attachmentData, setAttachmentData] = useState<Attachment>({
    name: "",
    fileType: "",
    uploadURL: "",
  });

  const descRef = useRef<HTMLDivElement | null>(null);
  const [descHeight, setDescHeight] = useState<number>(0);

  const [attachmentHeight, setAttachmentHeight] = useState<number>(0);

  const [attachmentParent] = useAutoAnimate();

  const { register, handleSubmit, setValue, getValues } = useForm<Desc>({
    defaultValues: {
      description: "",
    },
  });

  const utils = api.useContext();

  const { mutate: updateDesc, isLoading: updatingDesc } =
    api.boardCard.updateDescription.useMutation({
      onSuccess: (data) => {
        toast.success("Updated successfully");
        setEditDesc(false);
        setDescHeight(0);
        utils.boardCard.getDetails.setData(
          { cardID: cardDetails.id },
          (old) => {
            if (old === undefined) return old;
            return {
              ...old,
              description: data.description,
            };
          }
        );
      },
      onError: (err) => {
        toast.error("Sever error. Please try again later");
        console.log(err);
      },
    });

  const { mutate: createAttachment, isLoading: creatingAttachment } =
    api.boardCard.createAttachment.useMutation({
      onSuccess: (data) => {
        setUploadFile(false);
        toast.success("Added successfully");
        setAttachmentHeight(0);
        setAttachmentData({ name: "", fileType: "", uploadURL: "" });
        utils.boardCard.getDetails.setData(
          { cardID: cardDetails.id },
          (old) => {
            if (old === undefined) return old;
            return {
              ...old,
              Attachments: [...old.Attachments, data],
            };
          }
        );
      },
      onError: (err) => {
        err.message.includes('"Body excee"... is not valid JSON')
          ? toast.error("File's size is too big")
          : toast.error("Server error: Please try again later.");
        console.log(err);
      },
    });

  useEffect(() => {
    if (!descRef || !descRef.current) return;
    const rect = descRef.current.getBoundingClientRect();
    setDescHeight(rect.height);
  }, [descRef, setDescHeight, cardDetails.description]);

  useEffect(() => {
    const element = document.getElementById("attachments");
    if (!element) return;
    const rect = element.getBoundingClientRect();
    setAttachmentHeight(rect.height);
  }, [setAttachmentHeight, cardDetails.Attachments]);

  function handleFileChange(file: File) {
    const reader = (readFile: File) =>
      new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

    reader(file)
      .then((result: string) =>
        setAttachmentData((state) => ({ ...state, uploadURL: result }))
      )
      .catch((err) => console.log(err));
  }

  function onSubmit(data: Desc) {
    if (data.description === cardDetails.description) return setEditDesc(false);
    updateDesc({ cardID: cardDetails.id, description: data.description });
  }

  function onEdit() {
    if (editDesc) return;
    setEditDesc(true);
    setValue("description", cardDetails.description ?? "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function uploadAttachment(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files);
    const fileData = e.target.files ? e.target.files[0] : undefined;
    if (!fileData) return;
    handleFileChange(fileData);
    // const fileType = fileData.type.split("/")[0] ?? "";
    setAttachmentData((state) => ({
      ...state,
      name: fileData.name,
      fileType: fileData.type,
    }));
  }

  function addAttachment() {
    const { name, fileType, uploadURL } = attachmentData;
    if (fileType === "application/pdf") return toast.error("PDF not allowed.");
    createAttachment({
      name,
      fileType,
      attachment: uploadURL,
      cardID: cardDetails.id,
    });
  }

  return (
    <div className="col-span-2">
      <h1 className="text-base font-semibold text-gray-800">
        {cardDetails.title}
      </h1>

      <p className="mt-1.5 text-xs font-medium text-gray-400">
        In list{" "}
        <span className="font-semibold text-gray-800">
          {cardDetails.BoardList.name}
        </span>
      </p>

      <div className="mt-6 flex items-center gap-3">
        <p className="flex items-center gap-x-1 text-xs font-medium text-gray-400">
          <HiDocumentText />
          Description
        </p>
        <Button color="dark" size="xs" onClick={onEdit}>
          <AiFillEdit className="mr-1 h-3 w-3" />
          Edit
        </Button>
      </div>

      {editDesc ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextareaAutosize
            autoFocus
            minRows={2}
            defaultValue={getValues().description}
            {...register("description")}
            className="mt-3 w-full rounded-lg border-2 border-solid border-gray-800 text-sm font-semibold text-gray-700 focus:border-gray-800 focus:outline-0 focus:ring-0"
          />
          <div className="flex gap-x-2">
            <Button
              disabled={updatingDesc}
              type="submit"
              color="success"
              size="sm"
            >
              {updatingDesc ? <Spinner size="sm" light={true} /> : "Save"}
            </Button>
            <Button
              onClick={() => setEditDesc(false)}
              type="button"
              color="failure"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div
            ref={descRef}
            className={`mt-3 overflow-hidden whitespace-pre-wrap text-sm font-semibold text-gray-700 ${
              descHeight > 56 ? (seeMoreDesc ? "h-auto" : "h-14") : "h-auto"
            }`}
          >
            {cardDetails.description}
          </div>
          {descHeight > 56 ? (
            <button
              className="flex w-full cursor-pointer justify-end text-sm font-medium text-gray-400 hover:text-blue-500 hover:underline"
              onClick={() => setSeeMoreDesc((state) => !state)}
            >
              ...see {seeMoreDesc ? "less" : "more"}
            </button>
          ) : null}
        </>
      )}

      <div className="mt-6 flex items-center gap-3">
        <p className="flex items-center gap-x-1 text-xs font-medium text-gray-400">
          <HiDocumentText />
          Attachments
        </p>
        <Button color="dark" size="xs" onClick={() => setUploadFile(true)}>
          <AiOutlinePlus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>

      {uploadFile && (
        <>
          <input type="file" onChange={uploadAttachment} className="mt-2" />
          <div className="mt-2 flex gap-x-2">
            <Button
              disabled={creatingAttachment || !attachmentData.uploadURL}
              type="button"
              color="success"
              size="sm"
              onClick={addAttachment}
            >
              {creatingAttachment ? <Spinner size="sm" light={true} /> : "Add"}
            </Button>
            <Button
              onClick={() => setUploadFile(false)}
              type="button"
              color="failure"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </>
      )}

      <div
        ref={attachmentParent}
        id="attachments"
        className={`overflow-hidden text-sm font-semibold text-gray-700 ${
          attachmentHeight > 176
            ? seeMoreAttachments
              ? "h-auto"
              : "h-44"
            : "h-auto"
        }`}
      >
        {cardDetails.Attachments.map((a) => (
          <Attachment cardID={cardDetails.id} key={a.id} attachment={a} />
        ))}
      </div>
      {attachmentHeight > 176 ? (
        <button
          className="flex w-full cursor-pointer justify-end text-sm font-medium text-gray-400 hover:text-blue-500 hover:underline"
          onClick={() => setSeeMoreAttachments((state) => !state)}
        >
          ...see {seeMoreAttachments ? "less" : "more"}
        </button>
      ) : null}

      <CreateComment />

      <Comment />
      <Comment />
    </div>
  );
}
