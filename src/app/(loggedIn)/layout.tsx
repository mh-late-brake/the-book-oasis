export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-blue-500">
        <p className="text-4xl">This is layout</p>
      </div>
      {children}
    </div>
  );
}