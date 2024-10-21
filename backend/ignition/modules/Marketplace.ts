// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0x3D95a9C31D55D5eD979e79Ad3eC97Cc11cb6a514","0x3BEb27f12b3F54Ce4f3c11286085861Ecc1ACdCF"]);
  return { Marketplace };
});

export default MarketplaceModule;
