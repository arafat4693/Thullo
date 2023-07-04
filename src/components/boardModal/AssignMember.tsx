import { Avatar, Button, Dropdown, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import AvailableMembers from "./AvailableMembers";
import useDebounce from "~/hooks/useDebounce";

interface Props {
  labelElm: JSX.Element;
  btnName: string;
  title: string;
  subtitle: string;
}

export default function AssignMember({
  labelElm,
  btnName,
  title,
  subtitle,
}: Props) {
  const [searchKey, setSearchKey] = useState<string>("");
  const deferredSrcKey = useDebounce(searchKey, 500);

  const router = useRouter();

  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    api.user.getUsers.useInfiniteQuery(
      { searchKey: deferredSrcKey, boardID: router.query.id as string },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      placement="bottom"
      label={labelElm}
      className="min-w-[16rem] rounded-xl border border-solid border-gray-300 px-3"
    >
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>

      <TextInput
        type="text"
        placeholder="User..."
        required={true}
        onChange={(e) => setSearchKey(e.target.value)}
        value={searchKey}
        className="my-3 rounded-lg shadow-md"
      />

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Spinner aria-label="Large spinner example" size="lg" />
        </div>
      ) : (
        <AvailableMembers
          allMembers={data?.pages.flatMap((page) => page.users)}
          hasMore={hasNextPage}
          fetchNewBoards={fetchNextPage}
        />
      )}

      <Button className="mx-auto mt-5">{btnName}</Button>
    </Dropdown>
  );
}
