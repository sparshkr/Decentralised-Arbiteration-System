import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "amoy",
  networks: {
    hardhat: {
    },
    amoy: {
      url: "https://virtual.polygon-amoy.rpc.tenderly.co/30e2a40a-02eb-491b-bb35-19093435c1bf",
      accounts: ["07232d14bcaeecab26fba7eadd82ef94914e83d99c0b01fd1a2902fa0e300e94"]
    }
  },
  solidity: "0.8.27",
  ignition: {
    requiredConfirmations: 1
  },
};

export default config;
