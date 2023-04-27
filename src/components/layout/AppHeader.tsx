import { Navbar, Dropdown, Avatar, TextInput, Button } from "flowbite-react";
import { AiFillCaretDown } from "react-icons/ai";
import { CgMenuGridR } from "react-icons/cg";

export default function AppHeader() {
  return (
    <header className="AppHeader w-full border-0 border-b border-solid border-gray-200 bg-white">
      <nav className="mx-auto flex w-[92rem] max-w-full items-center justify-between p-3">
        <img
          src="/images/Logo.svg"
          className="mr-24 h-6 sm:h-9"
          alt="Tweeter Logo"
        />
        <div className="flex flex-grow items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-lg font-semibold text-gray-700">
              Devchallenges Board
            </h2>
            <span className="h-10 w-0.5 bg-gray-200"></span>
            <button className="flex items-center gap-2 rounded-lg bg-[#F2F2F2] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#e7e7e7]">
              <CgMenuGridR />
              All board
            </button>
          </div>
          <form className="flex w-[21.15rem] rounded-lg bg-white p-1 shadow-md">
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
            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          />
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <span className="flex cursor-pointer items-center gap-3 text-sm font-bold text-gray-700">
                Xanthe Neal
                <AiFillCaretDown />
              </span>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
}
