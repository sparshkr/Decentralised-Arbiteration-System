// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0x337c787D769109Fc47686ccf816281Ad26e610B6","0xb6806bcA6042C9328A4aeDac5B6270Ae4651811e"]);
  return { Marketplace };
});

export default MarketplaceModule;
