// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199","0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f"]);
  return { Marketplace };
});

export default MarketplaceModule;
