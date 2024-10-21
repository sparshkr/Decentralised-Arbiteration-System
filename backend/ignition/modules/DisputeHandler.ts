// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DisputeHandlerModule = buildModule("DisputeHandlerModule", (m) => {
  const DisputeHandler = m.contract("DisputeHandler", ["0x3D95a9C31D55D5eD979e79Ad3eC97Cc11cb6a514"]);
  return { DisputeHandler };
});

export default DisputeHandlerModule;
