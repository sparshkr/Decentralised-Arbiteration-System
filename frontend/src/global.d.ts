interface Window {
    ethereum?: {
      isMetaMask: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      // Add any other properties or methods you need
    };
  }
  