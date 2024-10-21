// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DisputeHandlerModule = buildModule("DisputeHandlerModule", (m) => {
  const DisputeHandler = m.contract("DisputeHandler", ["0x6Cad368371618bC56Ee6C70C2Fe4aF44a046C16A"]);
  return { DisputeHandler };
});

export default DisputeHandlerModule;
