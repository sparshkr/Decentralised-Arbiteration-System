"use client";

import React, { ReactNode, useState } from "react";
import { useWeb3 } from "@/provider/Web3Context";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

interface NavbarProps {
  children?: ReactNode;
}

const routeList: RouteProps[] = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const { connectToWeb3 } = useWeb3();
  const router = useRouter();

  const handleLogin = async (role: "juror" | "uploader") => {
    setIsPopoverOpen(false);
    try {
      await connectToWeb3();
      if (role === "juror") {
        router.push("/disputes");
      } else {
        router.push("/createDispute");
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <a href="/" className="ml-2 font-bold text-xl flex">
              <LogoIcon />
              ShadcnUI/React
            </a>
          </NavigationMenuItem>

          {/* Mobile Menu */}
          <span className="flex md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                />
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route, i) => (
              <a
                key={i}
                href={route.href}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="secondary" className="border">
                  <GitHubLogoIcon className="mr-2 w-5 h-5" />
                  Wallet
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none">Go to:</h4>
                  <div className="grid gap-2">
                    <Button onClick={() => handleLogin("juror")}>Juror</Button>
                    <Button onClick={() => handleLogin("uploader")}>
                      Dispute Uploader
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
