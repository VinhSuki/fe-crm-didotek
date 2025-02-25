import { Sidebar } from "@/components/layout/Partials/Sidebar";
import React from "react";

const DefaultLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* <Navbar />
        <MainContent>
          <Dashboard />
        </MainContent> */}
      </div>
    </div>
  );
};

export default DefaultLayout;
