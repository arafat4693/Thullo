import { Button, Spinner } from "flowbite-react";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import Attachment from "./Attachment";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import { RouterOutputs, api } from "~/utils/api";
import TextareaAutosize from "react-textarea-autosize";
import { ChangeEvent, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useCardDetailsModal } from "~/hooks/use-card-modal";
import { toast } from "react-hot-toast";

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
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<boolean>(false);
  const [attachmentData, setAttachmentData] = useState<Attachment>({
    name: "",
    fileType: "",
    uploadURL: "",
  });

  //test
  const [test, setTest] = useState<string>("");

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
        setTest(data.downloadURL);
      },
      onError: (err) => {
        err.message.includes('"Body excee"... is not valid JSON')
          ? toast.error("File's size is too big")
          : toast.error("Server error: Please try again later.");
        console.log(err);
      },
    });

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
    if (fileType.endsWith("pdf")) return toast.error("PDF not allowed.");
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
            {...register("description")}
            className="mt-3 w-full rounded-lg border-2 border-solid border-gray-800 text-sm font-semibold text-gray-700 focus:border-gray-800 focus:outline-0 focus:ring-0"
          >
            {getValues().description}
          </TextareaAutosize>
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
            className={`mt-3 overflow-hidden whitespace-pre-wrap text-sm font-semibold text-gray-700 ${
              seeMore ? "h-auto" : "h-14"
            }`}
          >
            {cardDetails.description}
          </div>
          <button
            className="flex w-full cursor-pointer justify-end text-sm font-medium text-gray-400 hover:text-blue-500 hover:underline"
            onClick={() => setSeeMore((state) => !state)}
          >
            ...see {seeMore ? "less" : "more"}
          </button>
        </>
      )}

      <div className="mt-4 flex items-center gap-3">
        <p className="flex items-center gap-x-1 text-xs font-medium text-gray-400">
          <HiDocumentText />
          Attachments
        </p>
        <Button color="dark" size="xs" onClick={() => setUploadFile(true)}>
          <AiOutlinePlus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>

      {uploadFile ? (
        <>
          <input type="file" onChange={uploadAttachment} className="mt-2" />
          <div className="mt-2 flex gap-x-2">
            <Button
              disabled={creatingAttachment}
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
      ) : (
        <>
          <Attachment />
          <Attachment />
        </>
      )}
      {test && (
        <a href={test} download>
          download
        </a>
      )}

      <CreateComment />

      <Comment />
      <Comment />
    </div>
  );
}
