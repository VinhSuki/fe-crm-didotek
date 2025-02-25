import { Button } from "@/components/ui/button";
import { useNavbarContext } from "@/context/NavbarContext";
import clsx from "clsx";
import { ChevronUp } from "lucide-react";

interface MainContentProps {
  children: React.ReactElement;
  title: string;
}

export function MainContent({ children, title }: MainContentProps) {
  const navbar = useNavbarContext();
  // console.log(navbar);
  return (
    <main className="flex-1 p-6 bg-background-overlay/5 space-y-5">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-emphasis text-lg font-bold">Danh sách {title}</h3>
          <p className="text-sm">Quản lý {title}</p>
        </div>
        <button
          className={clsx(
            "p-2 flex items-center justify-center border rounded-md hover:bg-background-overlay/20 transition-all duration-300",
            !navbar?.isOpenNavbar && "bg-primary"
          )}
          onClick={() => navbar?.setIsOpenNavbar(!navbar.isOpenNavbar)}
        >
          <span>
            <ChevronUp
              className={clsx(
                "w-6 h-6 transition-all duration-300",
                !navbar?.isOpenNavbar && "rotate-180 text-white"
              )}
            />
          </span>
        </button>
      </div>
      {children}
    </main>
  );
}
