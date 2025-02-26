import Main_Logo from "@/assets/images/logo/main_logo.png";
import White_Logo from "@/assets/images/logo/white_logo.png";
import Small_Logo from "@/assets/images/logo/small_logo.png";
import { FilterOption } from "@/models/interfaces";
import {
  ListFilter, // icon cho "Contains"
  X, // icon cho "Does not contain"
  ArrowRight, // icon cho "Starts with"
  ArrowLeft, // icon cho "Ends with"
  Equal, // icon cho "Equals"
  EqualNot, // icon cho "Does not equal"
  Search, // icon cho "Reset"
} from "lucide-react";

export const Images = {
  mainLogo: {
    url: Main_Logo,
    name: "Main Logo",
  },
  whiteLogo: {
    url: White_Logo,
    name: "White Logo",
  },
  smallLogo: {
    url: Small_Logo,
    name: "Small Logo",
  },
};

export const filterOptions: FilterOption[] = [
  {
    id: "contains",
    label: "Contains",
    icon: <ListFilter className="w-4 h-4" />,
  },
  {
    id: "not-contains",
    label: "Does not contain",
    icon: <X className="w-4 h-4" />,
  },
  {
    id: "starts-with",
    label: "Starts with",
    icon: <ArrowRight className="w-4 h-4" />,
  },
  {
    id: "ends-with",
    label: "Ends with",
    icon: <ArrowLeft className="w-4 h-4" />,
  },
  { id: "equals", label: "Equals", icon: <Equal className="w-4 h-4" /> },
  {
    id: "not-equals",
    label: "Does not equal",
    icon: <EqualNot className="w-4 h-4" />,
  },
  { id: "reset", label: "Reset", icon: <Search className="w-4 h-4" /> },
];
