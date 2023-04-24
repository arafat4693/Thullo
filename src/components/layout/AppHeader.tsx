import { Navbar, Dropdown, Avatar, TextInput, Button } from "flowbite-react";
import { AiFillCaretDown } from "react-icons/ai";

export default function AppHeader() {
  return (
    <header className="AppHeader w-full border-0 border-b border-solid border-gray-200 bg-white">
      <Navbar fluid={true} className="mx-auto max-w-[92rem]">
        <Navbar.Brand href="https://flowbite.com/">
          <img
            src="/images/Logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Tweeter Logo"
          />
        </Navbar.Brand>
        <div>
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
        <div className="flex items-center gap-3 md:order-2">
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
          <Navbar.Toggle />
        </div>
      </Navbar>
    </header>
  );
}
