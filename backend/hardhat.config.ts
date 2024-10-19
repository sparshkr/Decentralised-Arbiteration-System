import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "amoy",
  networks: {
    hardhat: {
    },
    amoy: {
      url: "https://virtual.polygon-amoy.rpc.tenderly.co/41e04a55-fc89-437d-b873-6aa59b1ec5af",
      accounts: ["07232d14bcaeecab26fba7eadd82ef94914e83d99c0b01fd1a2902fa0e300e94"]
    }
  },
  solidity: "0.8.27",
};

export default config;
