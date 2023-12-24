export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex w-full flex-col bg-white px-6 py-1 font-sans shadow-md">
        <div className="text-grey-darkest mx-auto mb-1 text-2xl">Home</div>
      </nav>
      <div className="">{children}</div>
    </>
  );
}
