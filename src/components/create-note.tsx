"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createNote } from "src/action/create-note";

export default function CreateNote({
  defaultOwnerId,
  listOfOwner,
}: {
  defaultOwnerId: number;
  listOfOwner: Array<{ id: number; name: string }>;
  //TODO fix any
}) {
  const [showForm, setShowForm] = useState(false);

  const toggleShowFormVisibility = () => setShowForm(!showForm);

  return (
    <>
      <NoteCard
        title="Create new note"
        content="Click here to create new note"
        owner="General Note"
        toggle={toggleShowFormVisibility}
      />
      {showForm && (
        <TextArea
          defaultOwnerId={defaultOwnerId}
          listOfOwner={listOfOwner}
          toggle={toggleShowFormVisibility}
        />
      )}
    </>
  );
}

const TextArea = ({
  defaultOwnerId,
  listOfOwner,
  toggle,
}: {
  defaultOwnerId: number;
  listOfOwner: Array<{ id: number; name: string }>;
  toggle: Function;
  //TODO fix any
}) => {
  const [formState, formAction] = useFormState(createNote, null);
  useEffect(() => {
    if (formState === "success") toggle();
  });
  return (
    <div
      onClick={() => toggle()}
      className="fixed left-20 top-0 h-full w-full bg-gray-500 bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/3 w-3/5 -translate-x-1/2 -translate-y-1/2 transform p-6"
      >
        <form action={formAction}>
          <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between border-t px-3 py-0">
              <div className="w-1/2">
                <input
                  type="text"
                  name="title"
                  className="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2 pt-2 text-lg font-medium text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                  placeholder="Note Title"
                  required
                />
              </div>
              <div>
                <select
                  name="selectedOwnerId"
                  className="text-md w-auto rounded-lg border border-gray-300 bg-transparent p-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={defaultOwnerId}
                >
                  {listOfOwner.map((owner) => (
                    <option value={owner.id} key={owner.id}>
                      {owner.name}
                    </option>
                  ))}
                </select>
                <SubmitButton />
              </div>
            </div>
            {formState &&
              typeof formState !== "string" &&
              typeof formState.error === "string" && (
                <p className="text-lg text-red-700">{formState.error}</p>
              )}
            {formState &&
              typeof formState !== "string" &&
              typeof formState.error !== "string" && (
                <p className="text-lg text-red-700">
                  {formState.error.selectedOwnerId}
                </p>
              )}
            {formState &&
              typeof formState !== "string" &&
              typeof formState.error !== "string" && (
                <p className="text-lg text-red-700">{formState.error.title}</p>
              )}
            <div className="rounded-t-lg bg-white px-4 py-2">
              <textarea
                name="content"
                rows={4}
                className="h-60 w-full border-0 bg-white px-0 text-sm text-gray-900 outline-none"
                placeholder="Write a note..."
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  if (!pending)
    return (
      <button
        type="submit"
        className="ml-6 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200"
      >
        Create Note
      </button>
    );
  else
    return (
      <button
        type="submit"
        className="ml-6 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200"
        disabled
      >
        <svg
          aria-hidden="true"
          role="status"
          className="me-3 inline h-4 w-4 animate-spin text-white"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Creating ...
      </button>
    );
};

const NoteCard = ({
  title,
  content,
  owner,
  toggle,
}: {
  title: string;
  content: string | null;
  owner: string | null;
  toggle: Function;
}) => {
  return (
    <div
      onClick={() => toggle()}
      className="flex h-52 max-w-sm flex-col justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow hover:bg-gray-100"
    >
      <div>
        <h5 className="mb-2 text-2xl font-medium tracking-tight text-gray-900">
          {title}
        </h5>
        <p className="font-normal text-gray-700">{content}</p>
      </div>
      <div className="flex items-center justify-end">
        <div className="rounded-lg bg-gray-200 px-2">{owner}</div>
      </div>
    </div>
  );
};
