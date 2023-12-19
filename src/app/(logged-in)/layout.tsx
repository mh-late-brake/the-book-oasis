import SideBar from "../../components/side-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideBar />
      <div className="ml-20">{children}</div>
    </>
  );
}
