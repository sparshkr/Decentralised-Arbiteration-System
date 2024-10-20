// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DisputeHandlerModule = buildModule("DisputeHandlerModule", (m) => {
  const DisputeHandler = m.contract("DisputeHandler", ["0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f"]);
  return { DisputeHandler };
});

export default DisputeHandlerModule;
