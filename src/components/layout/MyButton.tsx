import { IconType } from "react-icons";

interface Props {
  btnName: string;
  BtnIcon: IconType;
}

export default function MyButton({ btnName, BtnIcon }: Props) {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-[#F2F2F2] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#e7e7e7]">
      <BtnIcon />
      {btnName}
    </button>
  );
}
