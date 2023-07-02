import { Avatar, Button } from "flowbite-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { AiFillLock, AiOutlinePlus } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import AssignMember from "~/components/boardModal/AssignMember";
import BoardDetailModal from "~/components/boardModal/BoardDetailModal";
import BoardList from "~/components/boardPage/BoardList";
import Visibility from "~/components/boardPage/Visibility";
import AppHeader from "~/components/layout/AppHeader";
import Modal from "~/components/layout/Modal";
import MyButton from "~/components/layout/MyButton";

export default function board({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <AppHeader boardPage={true} userSession={userSession} />

      <section className="mt-4 w-full bg-white">
        <main className="mx-auto w-[92rem] max-w-full p-3">
          <nav className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Visibility />
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

          {/* <article className="styledScrollbarX mt-5 flex gap-x-8 rounded-xl bg-sky-100/60 p-4">
            <BoardList />
            <BoardList />
            <BoardList />
            <BoardList />
            <BoardList />
            <BoardList />
          </article> */}

          <article className="styledScrollbarX mt-5 flex gap-x-8 rounded-xl bg-sky-100/60 p-4">
            <div className="flex w-fit shrink-0 gap-x-8 overflow-hidden">
              <BoardList setShowModal={setShowModal} />
              <BoardList setShowModal={setShowModal} />
            </div>
            <Button className="w-60 shrink-0">Add Another List</Button>
          </article>
        </main>
      </section>

      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalBody={<BoardDetailModal setShowModal={setShowModal} />}
        />
      )}
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
      props: { userSession },
    };
  }

  // const ssg = createProxySSGHelpers({
  //   router: appRouter,
  //   ctx: createInnerTRPCContext({ session: userSession }),
  //   transformer: superjson,
  // });

  // await ssg.user.getUser.prefetch({ userID: boardID });

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      userSession,
      // boardID,
    },
  };
}
