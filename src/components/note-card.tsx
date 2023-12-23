export default function NoteCard({
  title,
  content,
  owner,
}: {
  title: string;
  content: string | null;
  owner: string | null;
}) {
  return (
    <div className="flex h-52 max-w-sm flex-col justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow hover:bg-gray-100">
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
}
