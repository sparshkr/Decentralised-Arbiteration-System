import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "local",
  networks: {
    local: {
      url:"http://127.0.0.1:8545/",
      accounts: ["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"]
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/amODZKSuYm8UwilQ5zfFmyq9iWGwc1CE",
      accounts: ["07232d14bcaeecab26fba7eadd82ef94914e83d99c0b01fd1a2902fa0e300e94"]
    }
  },
  solidity: "0.8.27",
  ignition: {
    requiredConfirmations: 1
  },
};

export default config;
