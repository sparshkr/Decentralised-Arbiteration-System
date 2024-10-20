// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GRULLModule = buildModule("GRULLModule", (m) => {
  const GRULL = m.contract("GRULL", ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"]);
  return { GRULL };
});

export default GRULLModule;
