import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavbarContext } from "@/context/NavbarContext";
import clsx from "clsx";
import { ChevronUp } from "lucide-react";

interface MainContentProps {
  children: React.ReactElement;
  title?: string;
  breadcrumb?: {
    parent: {
      title: string;
      url: string;
    };
    current: string;
  };
}

export function MainContent({ children, title, breadcrumb }: MainContentProps) {
  const navbar = useNavbarContext();
  return (
    <main className="flex-1 p-6 bg-background-overlay/5 space-y-5">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-emphasis text-lg font-bold">{title}</h3>
          {breadcrumb ? (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={breadcrumb.parent.url}
                    className="text-zinc-500 font-semibold"
                  >
                    {breadcrumb.parent.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-primary">
                    {breadcrumb.current}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <p className="text-sm">{title}</p>
          )}
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
