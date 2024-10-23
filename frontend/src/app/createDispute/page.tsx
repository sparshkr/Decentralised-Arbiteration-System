"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useWeb3 } from "@/provider/Web3Context";
import { ethers } from "ethers";
import contractABI from "@/contracts-data/ignition/deployments/chain-80002/artifacts/MarketplaceModule#Marketplace.json";
import ContractAddress from "@/contracts-data/ignition/deployments/chain-80002/deployed_addresses.json";
// import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

// Extract contract address correctly
const contractAddress = ContractAddress["MarketplaceModule#Marketplace"];

export default function CreateDisputeForm() {
  const [clientA, setClientA] = useState("");
  const [clientB, setClientB] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const { signer, connectToWeb3 } = useWeb3();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const connect = async () => {
      if (!signer) {
        await connectToWeb3(); // Try to connect on mount
      }
      setLoading(false); // Set loading to false after attempting to connect
    };
    connect();
  }, [signer, connectToWeb3]);

  useEffect(() => {
    if (!loading && !signer) {
      toast({
        title: "Login Required",
        description: "Please login first to view this page",
        variant: "destructive",
      });
      router.push("http://localhost:3000/Attachment");
    }
  }, [loading, signer, router]);

  useEffect(() => {
    const logSignerAddress = async () => {
      if (signer) {
        const address = await signer.getAddress();
        console.log("Signer:", address); // Log signer whenever it changes
      }
    };
    logSignerAddress(); // Call the async function
  }, [signer]);

  const handleSkillChange = (skill: string) => {
    setRequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) {
      toast({
        title: "Login Required",
        description: "Please connect your wallet to create a dispute.",
        variant: "destructive",
      });
      return;
    }

    if (!deadline) {
      toast({
        title: "Deadline Required",
        description: "Please select a voting deadline.",
        variant: "destructive",
      });
      return;
    }

    // Convert deadline to Unix timestamp
    const votingDeadlineInSeconds = Math.floor(
      deadline.getTime() / 1000 + 36000
    );

    try {
      // Interact with the contract to create a dispute
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      const tx = await contract.createDispute(
        clientA,
        clientB,
        description,
        votingDeadlineInSeconds,
        requiredSkills.map(skillToID)
      );

      await tx.wait(); // Wait for transaction to be confirmed
      console.log("dispute created");
      toast({
        title: "Dispute Created",
        description: "Your dispute has been successfully created.",
        variant: "default",
      });

      // Reset form after submission
      setClientA("");
      setClientB("");
      setDescription("");
      setRequiredSkills([]);
      setDeadline(undefined);
    } catch (error) {
      console.error("Error creating dispute:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while creating the dispute. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading indicator while connecting
  if (loading) {
    return <div>Loading...</div>;
  }

  // If signer is null or undefined, the useEffect will handle redirection
  if (!signer) {
    return null;
  }

  return (
    <div>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute right-[10%] bottom-[20%] w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-[128px] animate-blob"></div>
        <div className="absolute left-[60%] bottom-[10%] w-[300px] h-[300px] bg-yellow-500/30 rounded-full blur-[128px] animate-blob animation-delay-4000"></div>
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Dispute</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientA">Client A Address</Label>
                <Input
                  id="clientA"
                  placeholder="0x..."
                  value={clientA}
                  onChange={(e) => setClientA(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientB">Client B Address</Label>
                <Input
                  id="clientB"
                  placeholder="0x..."
                  value={clientB}
                  onChange={(e) => setClientB(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the dispute..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? (
                        format(deadline, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Skills Required by Jury Members</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="web-dev"
                    checked={requiredSkills.includes("web-dev")}
                    onCheckedChange={() => handleSkillChange("web-dev")}
                  />
                  <Label htmlFor="web-dev">Web Development</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ai-ml"
                    checked={requiredSkills.includes("ai-ml")}
                    onCheckedChange={() => handleSkillChange("ai-ml")}
                  />
                  <Label htmlFor="ai-ml">AI/ML</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="content-writing"
                    checked={requiredSkills.includes("content-writing")}
                    onCheckedChange={() => handleSkillChange("content-writing")}
                  />
                  <Label htmlFor="content-writing">Content Writing</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Dispute
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Helper function for converting skill name to skill ID
const skillToID = (skill: string) => {
  const skillMap: { [key: string]: number } = {
    "web-dev": 1,
    "ai-ml": 2,
    "content-writing": 3,
  };
  return skillMap[skill];
};
