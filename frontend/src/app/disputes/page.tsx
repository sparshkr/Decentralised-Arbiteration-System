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

// Define the Dispute type based on the provided struct
type Dispute = {
  id: number;
  clientA: string;
  clientB: string;
  description: string;
  isResolved: boolean;
};

// Mock data for disputes
const disputes: Dispute[] = [
  {
    id: 1,
    clientA: "0x1234...5678",
    clientB: "0xabcd...efgh",
    description: "Disagreement over project deliverables",
    isResolved: false,
  },
  {
    id: 2,
    clientA: "0x8765...4321",
    clientB: "0xijkl...mnop",
    description: "Payment dispute for completed work",
    isResolved: true,
  },
  {
    id: 3,
    clientA: "0x2468...1357",
    clientB: "0xqrst...uvwx",
    description: "Conflict regarding intellectual property rights",
    isResolved: false,
  },
  {
    id: 4,
    clientA: "0x1234...5678",
    clientB: "0xabcd...efgh",
    description: "Disagreement over project deliverables",
    isResolved: false,
  },
  {
    id: 5,
    clientA: "0x8765...4321",
    clientB: "0xijkl...mnop",
    description: "Payment dispute for completed work",
    isResolved: true,
  },
  {
    id: 6,
    clientA: "0x2468...1357",
    clientB: "0xqrst...uvwx",
    description: "Conflict regarding intellectual property rights",
    isResolved: false,
  },
];

export default function DisputePage() {
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
                  <Button className="w-full">
                    {dispute.isResolved ? "View Resolution" : "Resolve Dispute"}
                  </Button>
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
