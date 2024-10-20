// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DisputeHandlerModule = buildModule("DisputeHandlerModule", (m) => {
  const DisputeHandler = m.contract("DisputeHandler", ["0xb09da8a5B236fE0295A345035287e80bb0008290"]);
  return { DisputeHandler };
});

export default DisputeHandlerModule;
