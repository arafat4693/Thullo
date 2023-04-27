import { Avatar } from "flowbite-react";

export default function Comment() {
  return (
    <div className="mt-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            size="sm"
            img={
              "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            }
          />
          <div>
            <h3 className="text-sm font-bold capitalize leading-3 text-black">
              Sunny Islam
            </h3>
            <time
              dateTime="1970-12-14"
              className="text-xs font-medium text-gray-400"
            >
              24 August at 20:43
            </time>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
          <button>Edit</button>-<button>Delete</button>
        </div>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-700">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem
        veritatis sapiente quasi.
      </p>
    </div>
  );
}
