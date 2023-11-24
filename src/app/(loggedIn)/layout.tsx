export default function Layout({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <div className="bg-green-500">
        <p className="text-3xl">This is layout</p>
      </div>
			{children}
    </div>
  );
}
