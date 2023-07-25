import { Button, Spinner, TextInput } from "flowbite-react";
import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"form"> {
  type: "list" | "card";
  isLoading: boolean;
}

export default function CreateForm({
  onSubmit,
  type,
  isLoading,
  ...props
}: Props) {
  return (
    <form
      {...props}
      className="mt-3 w-full rounded-xl border-2 border-solid border-gray-200 bg-white p-2"
      onSubmit={onSubmit}
    >
      <TextInput type="text" placeholder={`Enter a title for this ${type}`} />
      <Button
        type="submit"
        color="success"
        size="sm"
        className={`mt-1 ${
          isLoading ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {isLoading ? (
          <>
            <div className="mr-3">
              <Spinner size="sm" light={true} />
            </div>
            Creating
          </>
        ) : (
          "Create"
        )}
      </Button>
    </form>
  );
}
