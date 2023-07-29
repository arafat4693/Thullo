import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { Alert, Avatar, Button } from "flowbite-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import superjson from "superjson";
import AssignMember from "~/components/boardModal/AssignMember";
import BoardDetailModal from "~/components/boardModal/BoardDetailModal";
import BoardList from "~/components/boardPage/BoardList";
import CreateForm from "~/components/boardPage/CreateForm";
import Visibility from "~/components/boardPage/Visibility";
import AppHeader from "~/components/layout/AppHeader";
import MyButton from "~/components/layout/MyButton";
import useCreateBoardList from "~/hooks/board/useCreateBoardList";
import { useCardDetailsModal } from "~/hooks/use-card-modal";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

export default function board({
  userSession,
  boardID,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [createListForm, setCreateListForm] = useState<boolean>(false);
  const [parent] = useAutoAnimate();
  const cardID = useCardDetailsModal((state) => state.cardID);
  const { data: currentBoard } = api.board.getSingle.useQuery(
    { boardID },
    {
      enabled: !!userSession,
    }
  );
  const { mutate: createList, isLoading: creatingList } = useCreateBoardList({
    setCreateListForm,
  });

  function listCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = (e.target as any)[0].value;
    if (!title) return toast.error("Title is required");
    createList({ boardID, name: title });
  }

  if (!userSession) {
    return (
      <Alert color="failure">
        <span>
          <span className="font-medium">Please Login first!</span> Permission
          Denied!!!
        </span>
      </Alert>
    );
  }

  if (!currentBoard) {
    return (
      <Alert color="failure">
        <span>
          <span className="font-medium">Not found!</span> Board not found.
        </span>
      </Alert>
    );
  }

  return (
    <>
      <AppHeader boardName={currentBoard.title} userSession={userSession} />

      <section className="mt-4 w-full bg-white">
        <main className="mx-auto w-[92rem] max-w-full p-3">
          <nav className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Visibility boardVisibility={currentBoard.visibility} />
              <Avatar
                size="sm"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              />

              <Avatar
                size="sm"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              />

              <AssignMember
                title="Invite to Board"
                subtitle="Search users you want to invite to"
                btnName="Invite"
                labelElm={
                  <p className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-blue-600 text-xl text-white hover:bg-blue-700">
                    <AiOutlinePlus />
                  </p>
                }
              />
            </div>

            <MyButton BtnIcon={BsThreeDots} btnName="Show Menu" />
          </nav>

          <article className="styledScrollbarX mt-5 flex gap-x-8 rounded-xl bg-sky-100/60 p-4">
            {currentBoard.boardLists.length ? (
              <div
                className="flex w-fit shrink-0 gap-x-8 overflow-hidden"
                ref={parent}
              >
                {currentBoard.boardLists.map((bl) => (
                  <BoardList key={bl.id} boardID={boardID} boardList={bl} />
                ))}
              </div>
            ) : null}
            <div className="w-60 shrink-0">
              <Button
                className="w-full"
                onClick={() => setCreateListForm((prev) => !prev)}
              >
                Add {currentBoard.boardLists.length ? "Another" : "A"} List
              </Button>
              {createListForm && (
                <CreateForm
                  onSubmit={listCreate}
                  isLoading={creatingList}
                  type="list"
                />
              )}
            </div>
          </article>
        </main>
      </section>

      {cardID && <BoardDetailModal />}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userSession = await getSession(context);

  if (context.params === undefined) {
    return {
      notFound: true,
    };
  }

  const boardID = context.params.id as string;

  if (userSession === null) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: { userSession, boardID },
    };
  }

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: userSession }),
    transformer: superjson,
  });

  await ssg.board.getSingle.prefetch({ boardID });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userSession,
      boardID,
    },
  };
}
