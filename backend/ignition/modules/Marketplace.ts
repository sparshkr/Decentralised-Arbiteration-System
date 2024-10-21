// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f","0xB581C9264f59BF0289fA76D61B2D0746dCE3C30D"]);
  return { Marketplace };
});

export default MarketplaceModule;
