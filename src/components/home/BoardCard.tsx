import { Avatar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";

interface Props {
  board: RouterOutputs["board"]["getAll"]["allBoards"][number];
}

export default function BoardCard({ board }: Props) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-md">
      <figure className="relative h-36 w-full rounded-xl">
        <Image
          className="h-full w-full rounded-xl object-cover"
          fill
          alt="Meaningful alt text for an image that is not purely decorative"
          src={board.cover}
        />
      </figure>
      <Link
        href={`/board/${board.id}`}
        className="my-2.5 block text-lg font-bold tracking-tight text-gray-900 hover:underline dark:text-white"
      >
        {board.title}
      </Link>
      {board.members.length ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {board.members.map((m) => (
            <Avatar key={m.id} size="sm" img={m.image ?? undefined} />
          ))}

          {board._count.members > 3 && (
            <span className="text-sm font-medium text-gray-400">
              {`+ ${board._count.members - 3} ${getPlural(
                board._count.members - 3,
                "other",
                "others"
              )}`}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string): string {
  return pluralRules.select(number) === "one" ? singular : plural;
}
