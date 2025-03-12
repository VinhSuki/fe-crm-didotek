import { Navbar } from "@/components/layout/Partials/Navbar";
import { Sidebar } from "@/components/layout/Partials/Sidebar";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
