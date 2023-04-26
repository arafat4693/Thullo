import { Button } from "flowbite-react";
import { type NextPage } from "next";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import BoardCard from "~/components/home/BoardCard";
import CreateBoardModal from "~/components/home/CreateBoardModal";
import Modal from "~/components/layout/Modal";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <section className="mx-auto w-[80rem] max-w-full p-3">
        <div className="flex items-center justify-between pt-8">
          <h2 className="text-lg font-semibold text-gray-700">All Boards</h2>
          <Button onClick={() => setShowModal(true)}>
            <AiOutlinePlus className="mr-1.5 text-base" />
            Add
          </Button>
        </div>

        <main className="mt-8 grid grid-cols-4 gap-7">
          <BoardCard />
          <BoardCard />
          <BoardCard />
          <BoardCard />
        </main>
      </section>

      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalBody={<CreateBoardModal setShowModal={setShowModal} />}
        />
      )}
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
