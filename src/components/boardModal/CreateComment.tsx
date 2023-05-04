import { Avatar, Button, Textarea } from "flowbite-react";

export default function CreateComment() {
  return (
    <form className="mt-8 flex items-start gap-x-2 rounded-xl border border-solid border-gray-300 p-3">
      <Avatar
        img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        size="sm"
      />
      <fieldset className="flex-grow">
        <Textarea placeholder="Write a comment..." required={true} rows={2} />
        <Button className="ml-auto mt-2.5" size="xs">
          Comment
        </Button>
      </fieldset>
    </form>
  );
}
