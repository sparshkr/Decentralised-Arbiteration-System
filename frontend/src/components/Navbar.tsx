"use client";

import React, { ReactNode, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
// import { useWeb3 } from "@/provider/Web3Context";
import { ethers } from "ethers";
import contractABI from "@/contracts-data/ignition/deployments/chain-80002/artifacts/MarketplaceModule#Marketplace.json";
import ContractAddress from "@/contracts-data/ignition/deployments/chain-80002/deployed_addresses.json";
// import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";
// Extract contract address correctly
const contractAddress = ContractAddress["MarketplaceModule#Marketplace"];

interface RouteProps {
  href: string;
  label: string;
}

interface NavbarProps {
  children?: ReactNode;
}

const routeList: RouteProps[] = [];

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isGrullPopoverOpen, setIsGrullPopoverOpen] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [grullAmount, setGrullAmount] = useState<string>("");
  const { signer, connectToWeb3 } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    const updateWalletAddress = async () => {
      if (signer) {
        try {
          const address = await signer.getAddress();
          setWalletAddress(address);
        } catch (error) {
          console.error("Error fetching address:", error);
          setWalletAddress("Error fetching address");
        }
      } else {
        await connectToWeb3();
      }
    };

    updateWalletAddress();
  }, [signer]);

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
    }
  };

  // const handleBuyGrull = () => {
  //   // Placeholder for GRULL purchase logic
  //   console.log(`Buying ${grullAmount} GRULL`);
  //   setIsGrullPopoverOpen(false);
  //   setGrullAmount("");
  // };

  const handleBuyGrull = async () => {
    if (!signer) {
      console.error("Signer not available, please connect your wallet");
      return;
    }

    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      // const ethValue = ethers.utils.parseEther(grullAmount);
      const ethValue = ethers.parseUnits(grullAmount, 18);

      const tx = await contract.buyGRULL({
        value: ethValue,
      });

      // Wait for the transaction to be confirmed
      await tx.wait();

      console.log(`Successfully bought ${grullAmount} GRULL`);
    } catch (error) {
      console.error("Error buying GRULL:", error);
    }

    setIsGrullPopoverOpen(false);
    setGrullAmount(""); // Clear the input field
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <a href="/" className="ml-2 font-bold text-xl flex">
              {/* <LogoIcon /> */}
              {/* ShadcnUI/React */}
              TrustJury
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
                    TrustJury
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
                  {walletAddress || "wallet not connected"}
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

            <Popover
              open={isGrullPopoverOpen}
              onOpenChange={setIsGrullPopoverOpen}
            >
              <PopoverTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={pulseAnimation}
                >
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Buy GRULL</span>
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none">Buy GRULL</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="grullAmount">Amount of GRULL to buy:</Label>
                    <Input
                      id="grullAmount"
                      type="number"
                      value={grullAmount}
                      onChange={(e) => setGrullAmount(e.target.value)}
                      placeholder="Enter GRULL amount"
                    />
                    <Button onClick={handleBuyGrull}>Confirm Purchase</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      {/* Render children if present */}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
};
