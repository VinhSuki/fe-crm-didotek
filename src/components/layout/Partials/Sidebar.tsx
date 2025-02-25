import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  title: string;
  url?: string;
  icon?: React.ElementType;
  subItems?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Getting Started",
    icon: ChevronDown,
    subItems: [
      { title: "Installation", url: "/installation" },
      { title: "Project Structure", url: "/project-structure" },
    ],
  },
  {
    title: "Building Your Application",
    icon: ChevronRight,
    subItems: [
      { title: "Overview", url: "/building-overview" },
      { title: "Components", url: "/building-components" },
    ],
  },
  {
    title: "API Reference",
    icon: ChevronRight,
    subItems: [
      { title: "Endpoints", url: "/api-endpoints" },
      { title: "Models", url: "/api-models" },
    ],
  },
  {
    title: "Architecture",
    icon: ChevronRight,
    subItems: [
      { title: "Patterns", url: "/architecture-patterns" },
      { title: "Best Practices", url: "/architecture-best-practices" },
    ],
  },
];

export function Sidebar() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="w-64 bg-white text-gray-700 border-r border-gray-200 h-screen p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Button
                variant="ghost"
                className="w-full text-left justify-start hover:bg-gray-100"
                onClick={() => item.subItems && toggleSection(item.title)}
              >
                {item.icon && (
                  <item.icon
                    className="mr-2 h-4 w-4"
                    style={{
                      transform: openSections.includes(item.title)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                )}
                <span>{item.title}</span>
              </Button>
              {item.subItems && openSections.includes(item.title) && (
                <ul className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.title}>
                      <Button
                        variant="ghost"
                        className="w-full text-left justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        asChild
                      >
                        <a href={subItem.url}>{subItem.title}</a>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
