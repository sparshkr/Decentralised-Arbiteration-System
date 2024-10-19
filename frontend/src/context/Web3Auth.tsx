/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useState, useEffect, useContext, createContext } from "react";

// import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
// import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
// import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import {
//   UserInfo,
//   IProvider,
//   CHAIN_NAMESPACES,
//   WEB3AUTH_NETWORK,
// } from "@web3auth/base";
// // import { getDefaultExternalAdapters } from '@web3auth/default-evm-adapter';
// // import {
// // 	WalletConnectV2Adapter,
// // 	getWalletConnectV2Settings,
// // } from '@web3auth/wallet-connect-v2-adapter';
// // import { MetamaskAdapter } from '@web3auth/metamask-adapter';
// import { Web3AuthContextDataType } from "../types/Web3AuthContextType";
// import RPC from "../blockchain/utils/ethersRPC"; // for using ethers.js

// const Web3ModalAuthContext = createContext<Web3AuthContextDataType | null>(
//   null
// );

// const clientId =
//   "BJMFh8p5ZzIV5vF9h-gwGxCPlPL7BGt2xUIYiQbu_7chgyDZbPSGAZNiv6l8wQ3Dc32IfaaSvAprZBBJpSktUjg";
// // Sepolia Testnet:

// // const chainConfig = {
// // 	chainNamespace: CHAIN_NAMESPACES.EIP155,
// // 	ticker: 'ETH',
// // 	chainId: '0xaa36a7',
// // 	tickerName: 'Ethereum',
// // 	displayName: 'Sepolia Testnet',
// // 	logo: 'https://images.toruswallet.io/eth.svg',
// // 	blockExplorerUrl: 'https://sepolia.etherscan.io/',
// // 	rpcTarget: 'https://sepolia.infura.io/v3/e7ca72369a974f718d5e099d8a6f12dc',
// // };

// // Polygon PoS Amoy Testnet:

// const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x13882", // hex of 80002, polygon testnet
//   rpcTarget: "https://rpc.ankr.com/polygon_amoy", // Avoid using public rpcTarget in production. Use services like Infura, Quicknode etc
//   displayName: "Polygon Amoy Testnet",
//   blockExplorerUrl: "https://amoy.polygonscan.com/",
//   ticker: "MATIC",
//   tickerName: "MATIC",
//   logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
// };

// const privateKeyProvider = new EthereumPrivateKeyProvider({
//   config: { chainConfig },
// });

// const web3AuthOptions: Web3AuthOptions = {
//   clientId,
//   privateKeyProvider: privateKeyProvider,
//   sessionTime: 864000,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//   uiConfig: {
//     uxMode: "popup",
//     appName: "HyDRAULIC",
//     appUrl: "https://web3auth.io/",
//     theme: {
//       primary: "#7ed6df",
//     },
//     logoLight: "https://web3auth.io/images/web3authlog.png",
//     logoDark: "https://web3auth.io/images/web3authlogodark.png",
//     defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
//     mode: "auto", // whether to enable dark mode. defaultValue: auto
//     useLogoLoader: true,
//   },
// };

// export const useWeb3Auth = () => {
//   const contextValue = useContext(Web3ModalAuthContext);

//   if (!contextValue) {
//     throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
//   }

//   return contextValue;
// };

// export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
//   const [userInfo, setUserInfo] = useState<Partial<UserInfo> | null>(null);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [walletServicesPlugin, setWalletServicesPlugin] =
//     useState<WalletServicesPlugin | null>(null);
//   const [provider, setProvider] = useState<IProvider | null>(null);

//   useEffect(() => {
//     async function init() {
//       try {
//         const web3auth = new Web3Auth(web3AuthOptions as Web3AuthOptions);

//         const openloginAdapter = new OpenloginAdapter({
//           loginSettings: {
//             mfaLevel: "optional",
//           },
//           adapterSettings: {
//             uxMode: "popup",
//             storageKey: "local",
//             mfaSettings: {
//               deviceShareFactor: {
//                 enable: true,
//                 priority: 1,
//                 mandatory: true,
//               },
//               backUpShareFactor: {
//                 enable: true,
//                 priority: 2,
//                 mandatory: false,
//               },
//               socialBackupFactor: {
//                 enable: true,
//                 priority: 3,
//                 mandatory: false,
//               },
//               passwordFactor: {
//                 enable: true,
//                 priority: 4,
//                 mandatory: true,
//               },
//             },
//             loginConfig: {
//               // google: {
//               // 	showOnModal: true
//               // }
//             },
//           },
//         });

//         web3auth.configureAdapter(openloginAdapter);

//         const walletServicesPlugin = new WalletServicesPlugin({
//           walletInitOptions: {
//             whiteLabel: {
//               showWidgetButton: true,
//               buttonPosition: "bottom-left",
//             },
//           },
//         });

//         setWalletServicesPlugin(walletServicesPlugin);
//         web3auth.addPlugin(walletServicesPlugin);

//         // For adding External default adapters (includes WalletConnect, Metamask, Torus EVM Wallet)

//         // const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
//         // adapters.forEach((adapter) => {
//         //   web3auth.configureAdapter(adapter);
//         // });

//         // Walletconnect v2 adapter

//         // *** Disabled ***

//         // const defaultWcSettings = await getWalletConnectV2Settings(
//         // 	'eip155',
//         // 	['11155111'],
//         // 	'04309ed1007e77d1f119b85205bb779d'
//         // );
//         // const walletConnectV2Adapter = new WalletConnectV2Adapter({
//         // 	...web3AuthOptions,
//         // 	adapterSettings: { ...defaultWcSettings.adapterSettings },
//         // 	loginSettings: { ...defaultWcSettings.loginSettings },
//         // });
//         // web3auth.configureAdapter(walletConnectV2Adapter);

//         // // Metamask adapter
//         // const metamaskAdapter = new MetamaskAdapter(web3AuthOptions);
//         // web3auth.configureAdapter(metamaskAdapter);

//         setWeb3auth(web3auth);
//         setProvider(web3auth.provider);

//         await web3auth.initModal();

//         if (web3auth.connected) {
//           setLoggedIn(true);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     init();
//   }, []);

//   // Helper functions to use connected wallet's functions inside application [yet to be exposed/used]
//   // =================================================================>

//   const login = async () => {
//     if (!web3auth) {
//       uiConsole("web3auth not initialized yet");
//       return;
//     }
//     await web3auth.connect();
//   };

//   const authenticateUser = async () => {
//     if (!web3auth) {
//       uiConsole("web3auth not initialized yet");
//       return;
//     }
//     const idToken = await web3auth.authenticateUser();
//     uiConsole(idToken);
//   };

//   const getUserInfo = async () => {
//     if (!web3auth) {
//       uiConsole("web3auth not initialized yet");
//       return;
//     }
//     const user = await web3auth.getUserInfo();
//     uiConsole(user);
//   };

//   const logout = async () => {
//     if (!web3auth) {
//       uiConsole("web3auth not initialized yet");
//       return;
//     }
//     await web3auth.logout();
//     setLoggedIn(false);
//   };

//   const showWCM = async () => {
//     if (!walletServicesPlugin) {
//       uiConsole("torus plugin not initialized yet");
//       return;
//     }
//     await walletServicesPlugin.showWalletConnectScanner();
//     uiConsole();
//   };

//   const showCheckout = async () => {
//     if (!walletServicesPlugin) {
//       uiConsole("torus plugin not initialized yet");
//       return;
//     }
//     console.log(web3auth?.connected);
//     await walletServicesPlugin.showCheckout();
//   };

//   const showWalletUi = async () => {
//     if (!walletServicesPlugin) {
//       uiConsole("torus plugin not initialized yet");
//       return;
//     }
//     await walletServicesPlugin.showWalletUi();
//   };

//   const getChainId = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const chainId = await rpc.getChainId();
//     uiConsole(chainId);
//   };

//   const addChain = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }

//     const newChain = {
//       chainNamespace: CHAIN_NAMESPACES.EIP155,
//       chainId: "0x89", // hex of 137, polygon mainnet
//       rpcTarget: "https://rpc.ankr.com/polygon",
//       // Avoid using public rpcTarget in production.
//       // Use services like Infura, Quicknode etc
//       displayName: "Polygon Mainnet",
//       blockExplorerUrl: "https://polygonscan.com",
//       ticker: "MATIC",
//       tickerName: "MATIC",
//       logo: "https://images.toruswallet.io/polygon.svg",
//     };

//     await web3auth?.addChain(newChain);
//     uiConsole("New Chain Added");
//   };

//   const switchChain = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     await web3auth?.switchChain({ chainId: "0x89" });
//     uiConsole("Chain Switched");
//   };

//   const getAccounts = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const address = await rpc.getAccounts();
//     uiConsole(address);
//     return address;
//   };

//   const getBalance = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const balance = await rpc.getBalance();
//     uiConsole(balance);
//   };

//   // TODO:
//   const sendTransaction = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const receipt = await rpc.sendTransaction();
//     uiConsole(receipt);
//   };

//   // TODO:
//   const signMessage = async (message: string) => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const signedMessage = await rpc.signMessage(message);
//     uiConsole(signedMessage);
//     return signedMessage;
//   };

//   const getContract = async (contract: any) => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const contractInstance = await rpc.getContract(
//       contract.abi,
//       contract.address
//     );
//     uiConsole(contractInstance);
//     console.log("Contract Instance: ");
//     console.log(contractInstance);

//     return contractInstance;
//   };

//   const getPrivateKey = async () => {
//     if (!web3auth?.provider) {
//       uiConsole("provider not initialized yet");
//       return;
//     }
//     const rpc = new RPC(web3auth.provider as IProvider);
//     const privateKey = await rpc.getPrivateKey();
//     uiConsole(privateKey);
//   };

//   function uiConsole(...args: any[]): void {
//     const el = document.querySelector("#console>p");
//     if (el) {
//       el.innerHTML = JSON.stringify(args || {}, null, 2);
//     }
//   }

//   const Web3ModalAuthContextData = {
//     provider,
//     web3auth,
//     loggedIn,
//     userInfo,
//     setUserInfo,
//     setProvider,
//     setLoggedIn,
//     signMessage,
//     getAccounts,
//     getContract,
//     sendTransaction,
//     walletServicesPlugin,
//   };

//   return (
//     <Web3ModalAuthContext.Provider value={Web3ModalAuthContextData}>
//       {children}
//     </Web3ModalAuthContext.Provider>
//   );
// };
// import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
// import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
// import { useEffect, useState } from "react";

// import RPC from "../blockchain/utils/ethersRPC";
// // import RPC from "./viemRPC";
// // import RPC from "./web3RPC";

// const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

// const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0xaa36a7",
//   rpcTarget: "https://rpc.ankr.com/eth_sepolia",
//   // Avoid using public rpcTarget in production.
//   // Use services like Infura, Quicknode etc
//   displayName: "Ethereum Sepolia Testnet",
//   blockExplorerUrl: "https://sepolia.etherscan.io",
//   ticker: "ETH",
//   tickerName: "Ethereum",
//   logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
// };

// const privateKeyProvider = new EthereumPrivateKeyProvider({
//   config: { chainConfig },
// });

// const web3AuthOptions: Web3AuthOptions = {
//   clientId,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
//   privateKeyProvider,
// }
// const web3auth = new Web3Auth(web3AuthOptions);

// const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
// adapters.forEach((adapter: IAdapter<unknown>) => {
//   web3auth.configureAdapter(adapter);
// });
