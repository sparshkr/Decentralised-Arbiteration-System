"use client";

import { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the Dispute type based on the provided struct
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

// Mock data for disputes (using only one dispute for brevity)
const disputes: Dispute[] = [
  {
    id: 1,
    title: "Dispute number 1",
    clientA: "0x1234...5678",
    clientB: "0xabcd...efgh",
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
  {
    id: 4,
    title: "Dispute number 4",
    clientA: "0x1234...5678",
    clientB: "0xabcd...efgh",
    clientAStatement: "This is client A statement",
    clientBStatement: "This is client B statement",
    description: "Disagreement over project deliverables",
    isResolved: false,
  },
  {
    id: 5,
    title: "Dispute number 5",
    clientA: "0x8765...4321",
    clientB: "0xijkl...mnop",
    clientAStatement: "This is client A statement",
    clientBStatement: "This is client B statement",
    description: "Payment dispute for completed work",
    isResolved: true,
  },
  {
    id: 6,
    title: "Dispute number 6",
    clientA: "0x2468...1357",
    clientB: "0xqrst...uvwx",
    clientAStatement: "This is client A statement",
    clientBStatement: "This is client B statement",
    description: "Conflict regarding intellectual property rights",
    isResolved: false,
  },
];

export default function DisputePage() {
  const [stakeAmount, setStakeAmount] = useState("");

  const handleStake = (disputeId: number) => {
    // Here you would implement the actual staking logic
    console.log(
      `Staking ${stakeAmount} GRULL tokens for dispute #${disputeId}`
    );
    // Reset stake amount and close popover (handled automatically by Popover component)
    setStakeAmount("");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Active Disputes</h1>
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
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="space-y-2 w-full">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                      Stake
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Stake GRULL Tokens
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Enter the amount of GRULL tokens you want to stake.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stakeAmount">Amount</Label>
                        <Input
                          id="stakeAmount"
                          type="number"
                          placeholder="Enter GRULL amount"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                        />
                      </div>
                      <Button onClick={() => handleStake(dispute.id)}>
                        Confirm Stake
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
