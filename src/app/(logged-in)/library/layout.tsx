export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex w-full flex-col bg-white px-6 py-1 font-sans shadow-md">
        <div className="mb-1">
          <p className="text-grey-darkest text-2xl">Library</p>
        </div>
      </nav>
      <div className="">{children}</div>
    </>
  );
}
