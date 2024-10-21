// Web3Context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface Web3ContextType {
  signer: ethers.Signer | null;
  connectToWeb3: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // useEffect(() => {
  //   console.log("Signer is ", signer);
  // }, [signer]);

  const connectToWeb3 = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        console.log("Connected to Web3 successfully", newSigner.address);
      } catch (error) {
        console.error("Error connecting with MetaMask:", error);
      }
    } else {
      console.warn("MetaMask not installed; using read-only defaults");
    }
  };

  return (
    <Web3Context.Provider value={{ signer, connectToWeb3 }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
