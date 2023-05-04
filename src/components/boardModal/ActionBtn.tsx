import type { IconType } from "react-icons";

interface Props {
  btnName: string;
  BtnIcon: IconType;
}

export default function ActionBtn({ btnName, BtnIcon }: Props) {
  return (
    <p className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-[#ededed] px-4 py-2 text-sm font-semibold text-gray-400 hover:bg-[#e2e2e2]">
      <BtnIcon />
      {btnName}
    </p>
  );
}
