import { RouterOutputs } from "~/utils/api";
import BoardCard from "./BoardCard";
import { Alert, Spinner } from "flowbite-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  allBoard: RouterOutputs["board"]["getAll"]["allBoards"] | undefined;
  hasMore: boolean | undefined;
  fetchNewBoards: () => Promise<unknown>;
}

export default function Boards({ allBoard, hasMore, fetchNewBoards }: Props) {
  const [parent] = useAutoAnimate();

  if (allBoard === undefined || allBoard.length === 0) {
    return (
      <Alert color="info" className="mt-8">
        <span>
          <span className="font-medium">No Board!</span> Please create one.
        </span>
      </Alert>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allBoard.length}
      hasMore={!!hasMore}
      next={fetchNewBoards}
      className="scrollbar-none"
      loader={
        <div className="mt-4 flex justify-center">
          <Spinner aria-label="Medium sized spinner example" size="md" />
        </div>
      }
    >
      <main className="mt-8 grid grid-cols-4 gap-7" ref={parent}>
        {allBoard.map((b) => (
          <BoardCard key={b.id} board={b} />
        ))}
      </main>
    </InfiniteScroll>
  );
}
