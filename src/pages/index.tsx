import { Alert, Button, Spinner } from "flowbite-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import BoardDetailModal from "~/components/boardModal/BoardDetailModal";
import BoardCard from "~/components/home/BoardCard";
import Boards from "~/components/home/Boards";
import CreateBoardModal from "~/components/home/CreateBoardModal";
import LoginModal from "~/components/home/LoginModal";
import AppHeader from "~/components/layout/AppHeader";
import Modal from "~/components/layout/Modal";
import { api } from "~/utils/api";

const Home = ({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    api.board.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: userSession?.user !== undefined,
      }
    );

  // console.log(data);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loginModal, setLoginModal] = useState<boolean>(false);

  if (isError) {
    <Alert color="failure">
      <span>
        <span className="font-medium">Server error!</span> Please try again
        later.
      </span>
    </Alert>;
  }

  return (
    <>
      <AppHeader
        boardPage={false}
        userSession={userSession}
        setLoginModal={setLoginModal}
      />

      <section className="mx-auto w-[80rem] max-w-full p-3">
        {userSession ? (
          <>
            <div className="flex items-center justify-between pt-8">
              <h2 className="text-lg font-semibold text-gray-700">
                All Boards
              </h2>
              <Button onClick={() => setShowModal(true)}>
                <AiOutlinePlus className="mr-1.5 text-base" />
                Add
              </Button>
            </div>

            {isLoading ? (
              <div className="mt-8 flex justify-center">
                <Spinner aria-label="Large spinner example" size="lg" />
              </div>
            ) : (
              <Boards
                allBoard={data?.pages.flatMap((page) => page.allBoards)}
                hasMore={hasNextPage}
                fetchNewBoards={fetchNextPage}
              />
            )}
          </>
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
      )}

      {loginModal && (
        <Modal
          showModal={loginModal}
          setShowModal={setLoginModal}
          modalBody={<LoginModal setShowModal={setLoginModal} />}
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
