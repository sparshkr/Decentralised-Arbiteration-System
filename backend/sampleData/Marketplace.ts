interface Dispute {
    id: number;
    clientA: string;
    clientB: string;
    description: string;
    votingDeadline: number;
    isResolved: boolean;
  }
  
  export const disputes: Dispute[] = [
    {
      id: 1,
      clientA: "0x1234567890abcdef1234567890abcdef12345678",
      clientB: "0xabcdef1234567890abcdef1234567890abcdef12",
      description: "Payment for services not received",
      votingDeadline: 1700000000, // Sample Unix timestamp
      isResolved: false
    },
    {
      id: 2,
      clientA: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      clientB: "0xabcdefabcdefabcdefabcdefabcdefabcdefefgh",
      description: "Dispute over quality of product delivered",
      votingDeadline: 1700001000, // Sample Unix timestamp
      isResolved: true
    },
    {
      id: 3,
      clientA: "0x123412341234123412341234123412341234abcd",
      clientB: "0x123412341234123412341234123412341234efgh",
      description: "Unpaid freelance work",
      votingDeadline: 1700002000, // Sample Unix timestamp
      isResolved: false
    }
  ];
  