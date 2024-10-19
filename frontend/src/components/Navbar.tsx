import { useState } from "react";
import { ethers } from "ethers";
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

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const web3Refs = useRef({
  //   conversionRate: null,
  //   provider: null,
  //   signer: null,
  //   contract_marketplace: null,
  //   contract_nft: null,
  //   contract_chainlinkGET: null
  // });

  // const connectToWeb3 = useCallback(async () => {
  const connectToWeb3 = async () => {
    if (window.ethereum != null) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        console.log("this is provider:", provider);
        console.log("this is signer:", signer);

        // web3Refs.current.contract_chainlinkGET = new Contract(address_chainlink, abi_chainlink, web3Refs.current.signer);
        // web3Refs.current.contract_nft = new Contract(address_nft, abi_nft, web3Refs.current.signer);
        // web3Refs.current.contract_marketplace = new Contract(address_marketplace, abi_marketplace, web3Refs.current.signer);

        console.log('Connected to Web3 successsfully');
      } catch (error) {
        console.log("Error connecting with metamask...");
        console.log(error);
      }
    } else {
      console.log("MetaMask not installed; using read-only defaults");
    }
  }
  // }, [firstVisit]);

  // useEffect(() => {
  //   connectToWeb3();
  // }, [count, connectToWeb3]);

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <LogoIcon />
              ShadcnUI/React
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    rel="noreferrer noopener"
                    href="https://github.com/leoMirandaa/shadcn-landing-page.git"
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    Github
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <a
              rel="noreferrer noopener"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
              onClick={async () => await connectToWeb3()}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              <button onClick={async () => await connectToWeb3()}>Wallet</button>
            </a>
            {/* <button
              onClick={() => connectToWeb3()}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Connect MetaMask
            </button> */}

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
