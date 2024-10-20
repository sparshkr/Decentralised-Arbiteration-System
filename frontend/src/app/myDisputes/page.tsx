"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BadgeDollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Assume useWeb3 is imported from your Web3 context or hook
import { useWeb3 } from "@/provider/Web3Context";

type Dispute = {
  title: string;
  id: number;
  clientA: string;
  clientB: string;
  description: string;
  isResolved: boolean;
  clientAStatement: string;
  clientBStatement: string;
};

// This function would be replaced with an actual API call or smart contract interaction
const fetchAllDisputes = async (): Promise<Dispute[]> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Dispute number 1",
          clientA: "0x1234...5678",
          clientB: "0xa72c3F809F43A8FF24DB83fe375809aF8ed2FD92",
          clientAStatement: "This is client A statement",
          clientBStatement: "This is client B statement",
          description: "Disagreement over project deliverables",
          isResolved: false,
        },
        {
          id: 2,
          title: "Dispute number 2",
          clientA: "0x8765...4321",
          clientB: "0xijkl...mnop",
          clientAStatement: "This is client A statement",
          clientBStatement: "This is client B statement",
          description: "Payment dispute for completed work",
          isResolved: true,
        },
        {
          id: 3,
          title: "Dispute number 3",
          clientA: "0x2468...1357",
          clientB: "0xqrst...uvwx",
          clientAStatement: "This is client A statement",
          clientBStatement: "This is client B statement",
          description: "Conflict regarding intellectual property rights",
          isResolved: false,
        },
      ]);
    }, 1000); // Simulate a 1-second delay
  });
};

export default function DisputePage() {
  const { signer, connectToWeb3 } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [signerAddress, setSignerAddress] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      if (!signer) {
        await connectToWeb3();
      }
      setLoading(false);
    };
    connect();
  }, [signer, connectToWeb3]);

  useEffect(() => {
    const getSignerAddress = async () => {
      if (signer) {
        try {
          const address = await signer.getAddress();
          setSignerAddress(address);
        } catch (error) {
          console.error("Failed to get signer address:", error);
        }
      }
    };
    getSignerAddress();
  }, [signer]);

  useEffect(() => {
    const loadDisputes = async () => {
      if (signerAddress) {
        setLoading(true);
        try {
          const allDisputes = await fetchAllDisputes();
          const filteredDisputes = allDisputes.filter(
            (dispute) =>
              dispute.clientA.toLowerCase() === signerAddress.toLowerCase() ||
              dispute.clientB.toLowerCase() === signerAddress.toLowerCase()
          );
          setDisputes(filteredDisputes);
        } catch (error) {
          console.error("Failed to fetch disputes:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadDisputes();
  }, [signerAddress]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!signer || !signerAddress) {
    return <div>Please connect your wallet to view disputes.</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Moving Shadow effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute right-[10%] bottom-[20%] w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-[128px] animate-blob"></div>
        <div className="absolute left-[60%] bottom-[10%] w-[300px] h-[300px] bg-yellow-500/30 rounded-full blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Your Active Disputes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Dispute #{dispute.id}
                    <Badge
                      variant={dispute.isResolved ? "secondary" : "destructive"}
                      className="text-sm"
                    >
                      {dispute.isResolved ? "Resolved" : "Unresolved"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Between {dispute.clientA} and {dispute.clientB}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{dispute.description}</p>
                  <Dialog>
                    <DialogTrigger>
                      {dispute.isResolved
                        ? "View Resolution"
                        : "Resolve Dispute"}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{dispute.title}</DialogTitle>
                        <DialogDescription>
                          {dispute.description}
                          <div>
                            <span className="text-white text-base">
                              Client A Statement:{" "}
                            </span>
                            {dispute.clientAStatement}
                          </div>
                          <div>
                            <span className="text-white text-base">
                              Client B Statement:{" "}
                            </span>
                            {dispute.clientBStatement}
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <span className="text-lg text-white">
                            Amount of tokens that you want to Stake:
                          </span>
                          <Label htmlFor="Stake Amount" className="sr-only">
                            Stake amount
                          </Label>
                          <div className="flex">
                            <Input
                              id="Stake Amount"
                              defaultValue="100"
                              readOnly
                              className="w-fit"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="p-3 mx-4"
                            >
                              <span className="sr-only">Copy</span>
                              <BadgeDollarSign className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
                <hr className="w-4/5 m-auto mb-4" />
                <CardFooter className="flex">
                  <div className="space-y-2">
                    <span className="flex items-center">
                      {dispute.isResolved ? (
                        <Check className="text-green-500 mr-2" />
                      ) : (
                        <X className="text-red-500 mr-2" />
                      )}
                      <h3 className="text-sm">Resolution status</h3>
                    </span>
                    <span className="flex items-center">
                      <Check className="text-green-500 mr-2" />
                      <h3 className="text-sm">Participant details</h3>
                    </span>
                    <span className="flex items-center">
                      <Check className="text-green-500 mr-2" />
                      <h3 className="text-sm">Dispute description</h3>
                    </span>
                    <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                      Start Voting
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
