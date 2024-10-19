// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  const Marketplace = m.contract("Marketplace", ["0x337c787D769109Fc47686ccf816281Ad26e610B6","0xf4ccefd95d16ff9890bced2da1f7ee2b53631f8f","0x337c787D769109Fc47686ccf816281Ad26e610B6"]);
  return { Marketplace };
});

export default MarketplaceModule;
