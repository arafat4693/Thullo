import { Alert, Button } from "flowbite-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import BoardDetailModal from "~/components/boardModal/BoardDetailModal";
import BoardCard from "~/components/home/BoardCard";
import CreateBoardModal from "~/components/home/CreateBoardModal";
import LoginModal from "~/components/home/LoginModal";
import AppHeader from "~/components/layout/AppHeader";
import Modal from "~/components/layout/Modal";

const Home = ({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loginModal, setLoginModal] = useState<boolean>(false);

  return (
    <>
      <AppHeader
        boardPage={false}
        userSession={userSession}
        setLoginModal={setLoginModal}
      />

      <section className="mx-auto w-[80rem] max-w-full p-3">
        {userSession && (
          <div className="flex items-center justify-between pt-8">
            <h2 className="text-lg font-semibold text-gray-700">All Boards</h2>
            <Button onClick={() => setShowModal(true)}>
              <AiOutlinePlus className="mr-1.5 text-base" />
              Add
            </Button>
          </div>
        )}

        {userSession ? (
          <main className="mt-8 grid grid-cols-4 gap-7">
            <BoardCard />
            <BoardCard />
            <BoardCard />
            <BoardCard />
          </main>
        ) : (
          <Alert color="info">
            <span>
              <span className="font-medium">Authentication alert!</span> Please
              log in first.
            </span>
          </Alert>
        )}
      </section>

      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalBody={<CreateBoardModal setShowModal={setShowModal} />}
        />
        // <Modal
        //   showModal={showModal}
        //   setShowModal={setShowModal}
        //   modalBody={<BoardDetailModal setShowModal={setShowModal} />}
        // />
      )}

      {loginModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalBody={<LoginModal setShowModal={setShowModal} />}
        />
      )}
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userSession = await getSession(context);

  // const ssg = createProxySSGHelpers({
  //   router: appRouter,
  //   ctx: createInnerTRPCContext({ session: userSession }),
  //   transformer: superjson,
  // });

  // await ssg.tweet.getTweets.prefetch();

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      userSession,
    },
  };
}
