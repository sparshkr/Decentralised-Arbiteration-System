import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import React, { ReactNode, useEffect, useState } from "react";
import { useWeb3 } from "@/provider/Web3Context";

import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ethers } from "ethers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import contractABI from "@/contracts-data/deployments/chain-80002/artifacts/MarketplaceModule#Marketplace.json";
import ContractAddress from "@/contracts-data/deployments/chain-80002/deployed_addresses.json";
// import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";
// Extract contract address correctly
const contractAddress = ContractAddress["MarketplaceModule#Marketplace"];

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

export const Hero = () => {
  const [isGrullPopoverOpen, setIsGrullPopoverOpen] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [grullAmount, setGrullAmount] = useState<string>("");
  const { signer, connectToWeb3 } = useWeb3();

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
    <section className="container relative grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 overflow-hidden">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              TrustJury
            </span>{" "}
            {/* is a decentralized arbitration service for the disputes of the new */}
            {/* economy. */}
          </h1>{" "}
          {/* for{" "} */}
          {/* <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              React
            </span>{" "}
            developers
          </h2> */}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          is a decentralized arbitration service for the disputes of the new
          economy.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          {/* <Button className="w-full md:w-1/3">Get Started</Button> */}
          {/* <Button onClick={handleBuyGrull}>Confirm Purchase</Button> */}
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
        </div>
      </div>

      {/* Hero cards sections */}
      {/* <div className="z-10">
        <HeroCards />
      </div> */}

      {/* Moving Shadow effect */}
      {/* <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute right-[10%] bottom-[20%] w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-[128px] animate-blob"></div>
        <div className="absolute left-[60%] bottom-[10%] w-[300px] h-[300px] bg-yellow-500/30 rounded-full blur-[128px] animate-blob animation-delay-4000"></div>
      </div> */}
    </section>
  );
};
