import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import Image from "next/image";
import {
  AiOutlineClose,
  AiFillLock,
  AiFillFileImage,
  AiOutlinePlus,
} from "react-icons/ai";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useCreateBoard from "~/hooks/board/useCreateBoard";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBoardInput, CreateBoardInputType } from "~/utils/zodSchemas";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function CreateBoardModal({ setShowModal }: Props) {
  const { mutate: createBoard, isLoading: createBoardLoading } = useCreateBoard(
    { setShowModal }
  );

  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      image: "",
      title: "",
      visibility: "PRIVATE",
    },
    resolver: zodResolver(CreateBoardInput),
  });

  function handleImageChange(file: File | undefined) {
    if (file === undefined) return;
    const reader = (readFile: File) =>
      new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });

    reader(file)
      .then((result: string) =>
        setValue("image", result, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        })
      )
      .catch((err) => console.log(err));
  }

  function onSubmit(data: FieldValues) {
    console.log(data);
    createBoard(data as CreateBoardInputType);
  }

  return (
    <form
      className="relative w-80 rounded-lg bg-white p-5 shadow-sm"
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Button
        size="xs"
        className="absolute right-2 top-2 z-10"
        onClick={() => setShowModal(false)}
      >
        <AiOutlineClose className="h-5 w-5" />
      </Button>
      {getValues().image && (
        <figure className="relative h-20 w-full rounded-xl">
          <Image
            className="h-full w-full rounded-lg object-cover"
            fill
            alt="Meaningful alt text for an image that is not purely decorative"
            src={getValues().image}
          />
        </figure>
      )}

      <TextInput
        type="text"
        placeholder="Add board title"
        {...register("title")}
        className="mt-3 rounded-lg border border-solid border-gray-300 shadow-md"
      />
      {errors.title?.message && (
        <Alert color="failure" className="mt-2">
          <p>{errors.title?.message.toString()}</p>
        </Alert>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button size="sm" color="dark" onClick={() => fileRef.current?.click()}>
          <AiFillFileImage className="mr-2 h-5 w-5" />
          Cover
        </Button>

        <Button
          size="sm"
          color="dark"
          onClick={() =>
            setValue(
              "visibility",
              getValues().visibility === "PRIVATE" ? "PUBLIC" : "PRIVATE",
              {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              }
            )
          }
        >
          <AiFillLock className="mr-2 h-5 w-5" />
          {getValues().visibility}
        </Button>
      </div>

      {errors.image?.message && (
        <Alert color="failure" className="mt-2">
          <p>{errors.image?.message.toString()}</p>
        </Alert>
      )}

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        onChange={(e) =>
          handleImageChange(e.target.files ? e.target.files[0] : undefined)
        }
      />

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button
          className="text-sm font-semibold text-gray-500"
          onClick={(e) => setShowModal(false)}
        >
          Cancel
        </button>
        <Button
          type="submit"
          size="sm"
          className={
            createBoardLoading ? "pointer-events-none" : "pointer-events-auto"
          }
        >
          {createBoardLoading ? (
            <>
              <div className="mr-3">
                <Spinner size="sm" light={true} />
              </div>
              Creating
            </>
          ) : (
            <>
              <AiOutlinePlus className="mr-2 h-4 w-4" />
              Create
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
