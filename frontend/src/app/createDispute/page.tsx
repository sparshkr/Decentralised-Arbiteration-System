"use client";

import { useState } from "react";
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

export default function CreateDisputeForm() {
  const [clientA, setClientA] = useState("");
  const [clientB, setClientB] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const handleSkillChange = (skill: string) => {
    setRequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend or smart contract
    console.log({ clientA, clientB, description, requiredSkills, deadline });
    // Reset form after submission
    setClientA("");
    setClientB("");
    setDescription("");
    setRequiredSkills([]);
    setDeadline(undefined);
  };

  return (
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
  );
}
