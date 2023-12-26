"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateNote } from "src/action/update-note";
import { deleteNote } from "src/action/delete-note";

export default function Notes({
  listOfNote,
  listOfOwner,
}: {
  listOfNote: Array<{
    noteId: number;
    noteTitle: string;
    noteContent: string | null;
    ownerId: number;
    ownerName: string;
  }>;
  listOfOwner: Array<{ ownerId: number; ownerName: string }>;
}) {
  const [modalState, setModalState] = useState<{
    noteId: number;
    noteTitle: string;
    noteContent: string | null;
    defaultOwnerId: number;
  } | null>(null);
  const dispatchModal = (noteId: number | null) => {
    if (!noteId) setModalState(null);
    else {
      const note = listOfNote.find((note) => note.noteId === noteId);
      if (!note)
        throw new Error(
          "Dev error: fetched noteids doesn't match fetched notes",
        );
      setModalState({
        noteId: note.noteId,
        noteTitle: note.noteTitle,
        noteContent: note.noteContent,
        defaultOwnerId: note.ownerId,
      });
    }
  };
  return (
    <>
      {listOfNote.map(({ noteId, noteTitle, noteContent, ownerName }) => (
        <NoteCard
          key={noteId}
          id={noteId}
          title={noteTitle}
          content={noteContent}
          owner={ownerName}
          dispatchModal={dispatchModal}
        />
      ))}
      {modalState && (
        <TextArea
          noteId={modalState.noteId}
          noteTitle={modalState.noteTitle}
          noteContent={modalState.noteContent}
          defaultOwnerId={modalState.defaultOwnerId}
          listOfOwner={listOfOwner}
          dispatchModal={dispatchModal}
        />
      )}
    </>
  );
}

const TextArea = ({
  noteId,
  noteTitle,
  noteContent,
  defaultOwnerId,
  listOfOwner,
  dispatchModal,
}: {
  noteId: number;
  noteTitle: string;
  noteContent: string | null;
  defaultOwnerId: number;
  listOfOwner: Array<{ ownerId: number; ownerName: string }>;
  dispatchModal: (noteId: number | null) => void;
}) => {
  const [formState, formAction] = useFormState(updateNote, null);
  const [deleteState, deleteFormAction] = useFormState(deleteNote, null);

  useEffect(() => {
    if (formState === "success" || deleteState === "success")
      dispatchModal(null);
  });
  const [title, setTitle] = useState(noteTitle);
  const [content, setContent] = useState(noteContent);
  const [owner, setOwner] = useState(String(defaultOwnerId));
  return (
    <div
      onClick={() => dispatchModal(null)}
      className="fixed left-20 top-0 z-50 h-full w-full bg-gray-500 bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/3 w-3/5 -translate-x-1/2 -translate-y-1/2 transform p-6"
      >
        <form action={formAction}>
          <input type="hidden" name="id" value={noteId} />
          <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between border-t px-3 py-0">
              <div className="w-1/2">
                <input
                  type="text"
                  name="title"
                  className="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2 pt-2 text-lg font-medium text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <select
                  name="selectedOwnerId"
                  className="text-md w-auto rounded-lg border border-gray-300 bg-transparent p-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                >
                  {listOfOwner.map((owner) => (
                    <option value={owner.ownerId} key={owner.ownerId}>
                      {owner.ownerName}
                    </option>
                  ))}
                </select>
                <UpdateButton />
                <DeleteButton deleteFormAction={deleteFormAction} />
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
            {deleteState && typeof deleteState === "string" && (
              <p className="text-lg text-red-700">{deleteState}</p>
            )}
            <div className="rounded-t-lg bg-white px-4 py-2">
              <textarea
                name="content"
                rows={4}
                className="h-60 w-full border-0 bg-white px-0 text-sm text-gray-900 outline-none"
                placeholder="Write a note..."
                value={content || ""}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const UpdateButton = () => {
  const { pending } = useFormStatus();
  if (!pending)
    return (
      <button
        type="submit"
        className="ml-6 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200"
      >
        Update
      </button>
    );
  else
    return (
      <button
        type="submit"
        className="ml-6 inline-flex items-center rounded-lg bg-blue-300 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-300 focus:ring-4 focus:ring-blue-200"
        disabled
      >
        Update
      </button>
    );
};

const DeleteButton = ({
  deleteFormAction,
}: {
  deleteFormAction: (payload: FormData) => void;
}) => {
  const { pending } = useFormStatus();
  if (!pending)
    return (
      <button
        type="submit"
        className="ml-2 inline-flex items-center rounded-lg bg-red-500 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-red-700 focus:ring-4 focus:ring-blue-200"
        formAction={deleteFormAction}
      >
        Delete Note
      </button>
    );
  else
    return (
      <button
        type="submit"
        className="ml-2 inline-flex items-center rounded-lg bg-red-300 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-red-300 focus:ring-4 focus:ring-blue-200"
      >
        Delete Note
      </button>
    );
};

const NoteCard = ({
  id,
  title,
  content,
  owner,
  dispatchModal,
}: {
  id: number;
  title: string;
  content: string | null;
  owner: string | null;
  dispatchModal: Function;
}) => {
  return (
    <div
      onClick={() => dispatchModal(id)}
      className="flex h-52 w-full flex-col justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow hover:bg-gray-100"
    >
      <div className="h-32 overflow-hidden">
        <h5 className="mb-2 text-2xl font-medium tracking-tight text-gray-900">
          {title}
        </h5>
        <p className="font-normal text-gray-700">{content}</p>
      </div>
      <div className="flex items-center justify-end">
        <div className="h-7 overflow-hidden rounded-lg bg-gray-200 px-2">
          {owner}
        </div>
      </div>
    </div>
  );
};
