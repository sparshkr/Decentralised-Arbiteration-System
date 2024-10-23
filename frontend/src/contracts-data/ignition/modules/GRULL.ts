// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GRULLModule = buildModule("GRULLModule", (m) => {
  const GRULL = m.contract("GRULL", ["0x337c787D769109Fc47686ccf816281Ad26e610B6"]);
  return { GRULL };
});

export default GRULLModule;
