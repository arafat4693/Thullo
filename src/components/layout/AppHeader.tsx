import { Navbar, Dropdown, Avatar, TextInput, Button } from "flowbite-react";
import { AiFillCaretDown } from "react-icons/ai";
import { CgMenuGridR } from "react-icons/cg";
import MyButton from "./MyButton";
import React, { Dispatch, SetStateAction } from "react";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";

interface Props {
  setLoginModal?: Dispatch<SetStateAction<boolean>>;
  userSession: Session | null;
  boardName?: string;
}

export default function AppHeader({
  setLoginModal,
  userSession,
  boardName,
}: Props) {
  return (
    <header className="AppHeader w-full border-0 border-b border-solid border-gray-200 bg-white">
      <nav className="mx-auto flex w-[92rem] max-w-full items-center justify-between p-3">
        <Link href="/">
          <img
            src="/images/Logo.svg"
            className="mr-24 h-6 sm:h-9"
            alt="Tweeter Logo"
          />
        </Link>
        {userSession ? (
          <>
            <div className="flex flex-grow items-center justify-between">
              {boardName && (
                <div className="flex items-center gap-5">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {boardName}
                  </h2>
                  <span className="h-10 w-0.5 bg-gray-200"></span>
                  <MyButton btnName="All board" BtnIcon={CgMenuGridR} />
                </div>
              )}
              <form className="ml-auto flex w-[21.15rem] rounded-lg bg-white p-1 shadow-md">
                <TextInput
                  id="keyword"
                  type="text"
                  placeholder="Keyword..."
                  color="white"
                  className="mr-1 w-full"
                />
                <Button>Search</Button>
              </form>
            </div>
            <div className="ml-11 flex items-center gap-3 md:order-2">
              <Avatar
                alt="User settings"
                img={userSession.user.image ?? undefined}
              />
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                  <span className="flex cursor-pointer items-center gap-3 text-sm font-bold text-gray-700">
                    {userSession.user.name}
                    <AiFillCaretDown />
                  </span>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{userSession.user.name}</span>
                  <span className="block truncate text-sm font-medium">
                    {userSession.user.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => void signOut()}>
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            </div>
          </>
        ) : (
          setLoginModal && (
            <Button onClick={() => setLoginModal(true)}>Log in</Button>
          )
        )}
      </nav>
    </header>
  );
}
