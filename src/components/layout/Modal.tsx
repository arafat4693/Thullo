import type { Dispatch, SetStateAction } from "react";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  modalBody: JSX.Element;
}

export default function Modal({ showModal, setShowModal, modalBody }: Props) {
  return (
    <section
      onClick={() => setShowModal(false)}
      className="modal fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-gray-300/70"
    >
      {modalBody}
    </section>
  );
}
