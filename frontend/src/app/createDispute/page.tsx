"use client";

import { useEffect, useState } from "react";
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

export default function CreateDisputeForm() {
  const [clientA, setClientA] = useState("");
  const [clientB, setClientB] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const { signer, connectToWeb3 } = useWeb3();
  const [loading, setLoading] = useState(true); // Loading state

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
    const logSignerAddress = async () => {
      if (signer) {
        const temp = await signer.getAddress(); // Await here
        console.log("Signer:", temp); // Log signer whenever it changes
      }
    };
    logSignerAddress(); // Call the async function
  }, [signer]);

  const handleSkillChange = (skill: string) => {
    setRequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) {
      console.error("Signer not available. Please connect your wallet.");
      return;
    }
    // Proceed with form submission logic
    console.log({ clientA, clientB, description, requiredSkills, deadline });
    // Reset form after submission
    setClientA("");
    setClientB("");
    setDescription("");
    setRequiredSkills([]);
    setDeadline(undefined);
  };

  // Show loading indicator while connecting
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a nice spinner or loader
  }

  return (
    <div>
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
            <Button type="submit" className="w-full" disabled={!signer}>
              Create Dispute
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
