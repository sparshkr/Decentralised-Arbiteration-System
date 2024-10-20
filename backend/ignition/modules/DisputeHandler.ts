// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DisputeHandlerModule = buildModule("DisputeHandlerModule", (m) => {
  const DisputeHandler = m.contract("DisputeHandler", ["0xb6806bcA6042C9328A4aeDac5B6270Ae4651811e"]);
  return { DisputeHandler };
});

export default DisputeHandlerModule;
