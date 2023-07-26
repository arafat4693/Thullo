import { BiMessageDetail } from "react-icons/bi";
import BoardListMenu from "./BoardListMenu";
import { Avatar, Button, Spinner, TextInput } from "flowbite-react";
import AssignMember from "../boardModal/AssignMember";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { IoIosAttach } from "react-icons/io";
import Image from "next/image";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { toast } from "react-hot-toast";
import CreateForm from "./CreateForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  boardList: RouterOutputs["board"]["getSingle"]["boardLists"][number];
  boardID: string;
}

export default function BoardList({ setShowModal, boardList, boardID }: Props) {
  const [rename, setRename] = useState<boolean>(false);
  const [createCardForm, setCreateCardForm] = useState(false);
  const utils = api.useContext();
  const [parent] = useAutoAnimate();

  const { mutate: renameList, isLoading } =
    api.board.renameBoardList.useMutation({
      onSuccess: (data) => {
        setRename(false);
        toast.success("Renamed successfully");
        utils.board.getSingle.setData({ boardID }, (old) => {
          if (old === undefined) return old;
          return {
            ...old,
            boardLists: [
              ...old.boardLists.map((b) =>
                b.id === boardList.id ? { ...b, name: data } : b
              ),
            ],
          };
        });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  const { mutate: createCard, isLoading: creatingCard } =
    api.board.createCard.useMutation({
      onSuccess: (data) => {
        toast.success("Successfully created");
        setCreateCardForm(false);
        utils.board.getSingle.setData({ boardID }, (old) => {
          if (old === undefined) return old;
          return {
            ...old,
            boardLists: [
              ...old.boardLists.map((b) =>
                b.id === boardList.id ? { ...b, cards: [...b.cards, data] } : b
              ),
            ],
          };
        });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  function listRename(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newName = (e.target as any)[0].value;
    if (!newName) return toast.error("Can't be empty");
    renameList({ boardListID: boardList.id, newName });
  }

  function cardCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = (e.target as any)[0].value;
    if (!title) return toast.error("Title is required");
    createCard({ boardID, title, listID: boardList.id });
  }

  return (
    <div className="w-64 shrink-0">
      {rename ? (
        <form className="flex h-10 gap-1" onSubmit={listRename}>
          <TextInput
            type="text"
            placeholder="New title"
            defaultValue={boardList.name}
            className="rounded-lg border border-solid border-gray-300"
          />
          <button
            disabled={isLoading}
            className="flex h-full w-10 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            {isLoading ? (
              <Spinner size="sm" light={true} />
            ) : (
              <AiOutlineCheck className="h-6 w-6" />
            )}
          </button>
          <div
            onClick={() => setRename(false)}
            className="flex h-full w-10 cursor-pointer items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            <RxCross2 className="h-6 w-6" />
          </div>
        </form>
      ) : (
        <header className="flex items-center justify-between text-sm font-semibold text-gray-700">
          {boardList.name}
          <BoardListMenu
            listID={boardList.id}
            boardID={boardID}
            setRename={setRename}
          />
        </header>
      )}

      <section className="mt-4 flex flex-col gap-3" ref={parent}>
        {boardList.cards.map((c) => (
          <main className="rounded-xl bg-white p-3 shadow-md">
            {c.cover && (
              <figure className="relative h-32 w-full rounded-xl">
                <Image
                  src="https://flowbite.com/docs/images/blog/image-1.jpg"
                  alt="item cover"
                  fill
                  className="h-full w-full rounded-xl object-cover"
                />
              </figure>
            )}
            <h3
              onClick={() => setShowModal(true)}
              className="mt-4 cursor-pointer text-base font-semibold text-gray-700 hover:underline"
            >
              {c.title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
                Technical
              </span>
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-500">
                Technical
              </span>
            </div>

            <footer className="mt-5 flex items-center justify-between">
              <div className="flex items-start gap-2">
                {c.assignedMembers.map((m) => (
                  <Avatar size="xs" img={m.image ?? undefined} />
                ))}

                {/* <Avatar
                  size="xs"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                /> */}

                {/* <AssignMember
                    title="Invite to Board"
                    subtitle="Search users you want to invite to"
                    btnName="Add"
                    labelElm={
                      <p className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-blue-600 text-sm text-white hover:bg-blue-700">
                        <AiOutlinePlus />
                      </p>
                    }
                  /> */}
              </div>

              <ul className="flex items-center gap-2.5">
                <li className="flex items-center gap-1 text-xs text-gray-400">
                  <BiMessageDetail />
                  {c._count.Comments}
                </li>
                <li className="flex items-center gap-1 text-xs text-gray-400">
                  <IoIosAttach />
                  {c._count.Attachments}
                </li>
              </ul>
            </footer>
          </main>
        ))}
      </section>

      <div className="mt-5 w-full">
        <Button
          className="w-full"
          onClick={() => setCreateCardForm((prev) => !prev)}
        >
          Add {boardList.cards.length ? "Another" : "A"} Card
        </Button>
        {createCardForm && (
          <CreateForm
            onSubmit={cardCreate}
            isLoading={creatingCard}
            type="card"
          />
        )}
      </div>
    </div>
  );
}
