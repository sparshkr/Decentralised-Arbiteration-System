// "use client";

// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Check, X } from "lucide-react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // Define the Dispute type based on the provided struct
// type Dispute = {
//   title: string;
//   id: number;
//   clientA: string;
//   clientB: string;
//   description: string;
//   isResolved: boolean;
//   clientAStatement: string;
//   clientBStatement: string;
// };

// // Mock data for disputes (using only one dispute for brevity)
// const disputes: Dispute[] = [
//   {
//     id: 1,
//     title: "Dispute number 1",
//     clientA: "0x1234...5678",
//     clientB: "0xabcd...efgh",
//     clientAStatement: "This is client A statement",
//     clientBStatement: "This is client B statement",
//     description: "Disagreement over project deliverables",
//     isResolved: false,
//   },
//   {
//     id: 2,
//     title: "Dispute number 2",
//     clientA: "0x8765...4321",
//     clientB: "0xijkl...mnop",
//     clientAStatement: "This is client A statement",
//     clientBStatement: "This is client B statement",
//     description: "Payment dispute for completed work",
//     isResolved: true,
//   },
//   {
//     id: 3,
//     title: "Dispute number 3",
//     clientA: "0x2468...1357",
//     clientB: "0xqrst...uvwx",
//     clientAStatement: "This is client A statement",
//     clientBStatement: "This is client B statement",
//     description: "Conflict regarding intellectual property rights",
//     isResolved: false,
//   },
//   {
//     id: 4,
//     title: "Dispute number 4",
//     clientA: "0x1234...5678",
//     clientB: "0xabcd...efgh",
//     clientAStatement: "This is client A statement",
//     clientBStatement: "This is client B statement",
//     description: "Disagreement over project deliverables",
//     isResolved: false,
//   },
//   {
//     id: 5,
//     title: "Dispute number 5",
//     clientA: "0x8765...4321",
//     clientB: "0xijkl...mnop",
//     clientAStatement: "This is client A statement",
//     clientBStatement: "This is client B statement",
//     description: "Payment dispute for completed work",
//     isResolved: true,
//   },
//   {
//     id: 6,
//     title: "Dispute number 6",
//     clientA: "0x2468...1357",
//     clientB: "0xqrst...uvwx",
//     clientAStatement: "This is client A statement",
//     clientBStatement: "This is client B statement",
//     description: "Conflict regarding intellectual property rights",
//     isResolved: false,
//   },
// ];

// export default function DisputePage() {
//   const [stakeAmount, setStakeAmount] = useState("");

//   const handleStake = (disputeId: number) => {
//     // Here you would implement the actual staking logic
//     console.log(
//       `Staking ${stakeAmount} GRULL tokens for dispute #${disputeId}`
//     );
//     // Reset stake amount and close popover (handled automatically by Popover component)
//     setStakeAmount("");
//   };

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Active Disputes</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {disputes.map((dispute) => (
//           <Card key={dispute.id} className="w-full">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 Dispute #{dispute.id}
//                 <Badge
//                   variant={dispute.isResolved ? "secondary" : "destructive"}
//                   className="text-sm"
//                 >
//                   {dispute.isResolved ? "Resolved" : "Unresolved"}
//                 </Badge>
//               </CardTitle>
//               <CardDescription className="text-sm text-muted-foreground">
//                 Between {dispute.clientA} and {dispute.clientB}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm mb-4">{dispute.description}</p>
//             </CardContent>
//             <CardFooter className="flex flex-col items-start">
//               <div className="space-y-2 w-full">
//                 <span className="flex items-center">
//                   {dispute.isResolved ? (
//                     <Check className="text-green-500 mr-2" />
//                   ) : (
//                     <X className="text-red-500 mr-2" />
//                   )}
//                   <h3 className="text-sm">Resolution status</h3>
//                 </span>
//                 <span className="flex items-center">
//                   <Check className="text-green-500 mr-2" />
//                   <h3 className="text-sm">Participant details</h3>
//                 </span>
//                 <span className="flex items-center">
//                   <Check className="text-green-500 mr-2" />
//                   <h3 className="text-sm">Dispute description</h3>
//                 </span>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
//                       Stake
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-80">
//                     <div className="grid gap-4">
//                       <div className="space-y-2">
//                         <h4 className="font-medium leading-none">
//                           Stake GRULL Tokens
//                         </h4>
//                         <p className="text-sm text-muted-foreground">
//                           Enter the amount of GRULL tokens you want to stake.
//                         </p>
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="stakeAmount">Amount</Label>
//                         <Input
//                           id="stakeAmount"
//                           type="number"
//                           placeholder="Enter GRULL amount"
//                           value={stakeAmount}
//                           onChange={(e) => setStakeAmount(e.target.value)}
//                         />
//                       </div>
//                       <Button onClick={() => handleStake(dispute.id)}>
//                         Confirm Stake
//                       </Button>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }



































'use client'
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BadgeDollarSign } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/provider/Web3Context";
import { ethers } from "ethers";

import { useEffect, useState } from "react";
// import contractABI from "@/artifacts/MarketplaceModule#Marketplace.json";
import contractABI from "@/contracts-data/deployments/chain-31337/artifacts/MarketplaceModule#Marketplace.json";
import contractABI1 from "@/contracts-data/deployments/chain-31337/artifacts/DisputeHandlerModule#DisputeHandler.json";
import { Checkbox } from "@/components/ui/checkbox";
import ContractAddress from "@/contracts-data/deployments/chain-31337/deployed_addresses.json";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { log } from "util";
const contractAddress = ContractAddress["MarketplaceModule#Marketplace"];
const contractAddress1 = ContractAddress["DisputeHandlerModule#DisputeHandler"];

// const contractAddress = "68c4ba2144356ec2e55f19c01eef0fdb";


// Define the Dispute type based on the provided struct
type Dispute = {
  id: number;
  creator: string; // Added creator field
  clientA: string;
  clientB: string;
  description: string;
  skillsReqd: number[]; // Updated to reflect skills required as an array
  votingDeadline: number; // Adjusted type for voting deadline if needed
  isResolved: boolean;
};

// Mock data for disputes
// const disputes: Dispute[] = [
//   {
//     id: 1,
//     title:"Dispute number 1",
//     clientA: "0x1234...5678",
//     clientB: "0xabcd...efgh",
//     clientAStatement:"This is client A statement",
//     clientBStatement:"This is client B statement",
//     description: "Disagreement over project deliverables",
//     isResolved: false,
//   },
//   {
//     id: 2,
//     title:"Dispute number 2",
//     clientA: "0x8765...4321",
//     clientB: "0xijkl...mnop",
//     clientAStatement:"This is client A statement",
//     clientBStatement:"This is client B statement",
//     description: "Payment dispute for completed work",
//     isResolved: true,
//   },
//   {
//     id: 3,
//     title:"Dispute number 3",
//     clientA: "0x2468...1357",
//     clientB: "0xqrst...uvwx",
//     clientAStatement:"This is client A statement",
//     clientBStatement:"This is client B statement",
//     description: "Conflict regarding intellectual property rights",
//     isResolved: false,
//   },
//   {
//     id: 4,
//     title:"Dispute number 4",
//     clientA: "0x1234...5678",
//     clientB: "0xabcd...efgh",
//     clientAStatement:"This is client A statement",
//     clientBStatement:"This is client B statement",
//     description: "Disagreement over project deliverables",
//     isResolved: false,
//   },
//   {
//     id: 5,
//     title:"Dispute number 5",
//     clientA: "0x8765...4321",
//     clientB: "0xijkl...mnop",
//     clientAStatement:"This is client A statement",
//     clientBStatement:"This is client B statement",
//     description: "Payment dispute for completed work",
//     isResolved: true,
//   },
//   {
//     id: 6,
//     title:"Dispute number 6",
//     clientA: "0x2468...1357",
//     clientB: "0xqrst...uvwx",
//     clientAStatement:"This is client A statement",
//     clientBStatement:"This is client B statement",
//     description: "Conflict regarding intellectual property rights",
//     isResolved: false,
//   },
// ];


export default function DisputePage() {

  const { signer } = useWeb3(); // assuming this returns your web3 provider
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedClient,setSelectedClient] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const skillsMap: { [key: string]: number } = {
    "Web Development": 1,
    "AI/ML": 2,
    "Content Writing": 3,
  };
  

  const handleStake = (disputeId: number) => {
    // Here you would implement the actual staking logic
    console.log(
      `Staking ${stakeAmount} GRULL tokens for dispute #${disputeId}`
    );

    try{
    const contract = new ethers.Contract(contractAddress1, contractABI1.abi, signer);


    let stakeamt = stakeAmount;
    const voteforA = selectedClient == "clientA" ? 1 : 0;
    console.log(disputeId);
    console.log(voteforA);

    console.log(stakeamt);

    const skillNumbers = skills.map(skill => skillsMap[skill]);
    console.log(skillNumbers);  // [1, 2] if "Web Development" and "AI/ML" are selected

    // Call the contract method with skills array
    contract.stakeAndVote(disputeId, voteforA, stakeamt, skillNumbers);

    
      
      

    }catch(error){
      console.error("Error staking and voting:", error);
    }

    // Reset stake amount and close popover (handled automatically by Popover component)
    setStakeAmount("");
  };


 const handleSkillChange = (skill: string) => {
    setSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };


  useEffect(() => {
    const fetchDisputes = async () => {
      if (!signer) return;

      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      console.log("Contract", contract);

      // const disputeCount = 5;
      let disputeCount = await contract.getDisputeCount();
      disputeCount = Number(disputeCount);
      console.log("fsA", disputeCount);

      const disputesData: Dispute[] = [];
      for (let i = 1; i <= disputeCount; i++) {
        const dispute = await contract.getDispute(i);
        console.log("Here");
        
        disputesData.push({
          id: Number(dispute.id), // Assuming id is a BigNumber, convert it to number
          creator: dispute.creator, // Fetch creator's address
          clientA: dispute.clientA,
          clientB: dispute.clientB,
          description: dispute.description,
          skillsReqd: dispute.skillsReqd, // Assuming skillsReqd is fetched as an array
          votingDeadline:Number( dispute.votingDeadline), // Assuming votingDeadline is a BigNumber, convert to number
          isResolved: dispute.isResolved,
        });
      }

      setDisputes(disputesData);
    };

    fetchDisputes();
  }, [signer]);


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
                          Enter the amount of GRULL tokens you want to stake and
                          select a client to vote for.
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
                      <div className="grid gap-2">
                        <Label>Vote for</Label>
                        <RadioGroup
                          value={selectedClient}
                          onValueChange={setSelectedClient}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clientA" id="clientA" />
                            <Label htmlFor="clientA">
                              Client A ({dispute.clientA})
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clientB" id="clientB" />
                            <Label htmlFor="clientB">
                              Client B ({dispute.clientB})
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid gap-2">
                        <Label>Choose your skills</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="webDev"
                              checked={skills.includes("Web Development")}
                              onCheckedChange={() =>
                                handleSkillChange("Web Development")
                              }
                            />
                            <Label htmlFor="webDev">Web Development</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="aiMl"
                              checked={skills.includes("AI/ML")}
                              onCheckedChange={() => handleSkillChange("AI/ML")}
                            />
                            <Label htmlFor="aiMl">AI/ML</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="contentWriting"
                              checked={skills.includes("Content Writing")}
                              onCheckedChange={() =>
                                handleSkillChange("Content Writing")
                              }
                            />
                            <Label htmlFor="contentWriting">
                              Content Writing
                            </Label>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStake(dispute.id)}
                        disabled={
                          !stakeAmount || !selectedClient || skills.length === 0
                        }
                      >
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
