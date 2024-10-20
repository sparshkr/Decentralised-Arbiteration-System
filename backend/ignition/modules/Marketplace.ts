// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0xb09da8a5B236fE0295A345035287e80bb0008290","0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f"]);
  return { Marketplace };
});

export default MarketplaceModule;
