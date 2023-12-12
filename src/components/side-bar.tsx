import { signOut } from "@/auth";
import { MdPerson } from "react-icons/md";
import { GoHome, GoGraph } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { CiStickyNote } from "react-icons/ci";
import { PiSignOut } from "react-icons/pi";
import Link from "next/link";
import { ReactNode } from "react";

export default function SideBar() {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-20 flex-col bg-slate-200 shadow-xl">
      <Link href="user-profile">
        <SideBarIcon icon={<MdPerson size="55" />} text="User Profile" />
      </Link>
      <Link href="/home">
        <SideBarIcon icon={<GoHome size="55" />} text="Home" />
      </Link>
      <Link href="/library">
        <SideBarIcon icon={<VscLibrary size="50" />} text="Library" />
      </Link>
      <Link href="notes">
        <SideBarIcon icon={<CiStickyNote size="55" />} text="Notes" />
      </Link>
      <Link href="/statistics">
        <SideBarIcon icon={<GoGraph size="45" />} text="Statistics" />
      </Link>
      <Divider />
      <SignOutButton />
    </div>
  );
}

const SideBarIcon = ({ icon, text = "tooltip" }: { icon: ReactNode; text: any }) => (
  <div className="group relative mx-auto mb-2 mt-2 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-gray-600 shadow-lg hover:rounded-xl hover:bg-gray-600 hover:text-white">
    {icon}
    <span className="absolute left-20 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-gray-300 p-2 text-xl text-gray-600 shadow-md transition-all duration-100 group-hover:scale-100">
      {text}
    </span>
  </div>
);

const SignOutButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button className="w-full">
        <SideBarIcon icon={<PiSignOut size="45" />} text="Sign Out" />
      </button>
    </form>
  );
};

const Divider = () => (
  <hr className="mx-2; rounded-full border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800" />
);
