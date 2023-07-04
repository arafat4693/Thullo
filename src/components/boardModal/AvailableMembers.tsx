import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Alert, Avatar, Spinner } from "flowbite-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { RouterOutputs } from "~/utils/api";

interface Props {
  allMembers: RouterOutputs["user"]["getUsers"]["users"] | undefined;
  hasMore: boolean | undefined;
  fetchNewBoards: () => Promise<unknown>;
}

export default function AvailableMembers({
  allMembers,
  hasMore,
  fetchNewBoards,
}: Props) {
  if (allMembers === undefined || allMembers.length === 0) {
    return (
      <Alert color="info" className="mt-8">
        <span>
          <span className="font-medium">No user!</span>
        </span>
      </Alert>
    );
  }

  const [parent] = useAutoAnimate();

  return (
    <div
      id="scrollableDiv"
      ref={parent}
      className="styledScrollbarY max-h-[9rem] rounded-lg border border-solid border-gray-300 p-3 shadow-md"
    >
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={allMembers.length}
        hasMore={!!hasMore}
        next={fetchNewBoards}
        className="scrollbar-none"
        loader={
          <div className="mt-3 flex justify-center">
            <Spinner aria-label="Medium sized spinner example" size="md" />
          </div>
        }
      >
        {allMembers.map((m, idx) => (
          <figure
            className={`${
              idx === allMembers.length - 1 ? "" : "mb-3"
            } flex cursor-pointer items-center gap-x-3 hover:bg-gray-200`}
            key={m.id}
          >
            <Avatar size="sm" img={m.image ?? undefined} />
            <figcaption className="text-sm font-bold text-gray-700">
              {m.name}
            </figcaption>
          </figure>
        ))}
      </InfiniteScroll>
    </div>
  );
}
