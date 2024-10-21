// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0x6Cad368371618bC56Ee6C70C2Fe4aF44a046C16A","0x076564e12fAB481B30EAE1a4C2FC1A816c7C2429"]);
  return { Marketplace };
});

export default MarketplaceModule;
