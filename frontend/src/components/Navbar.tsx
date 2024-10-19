import { useEffect,useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";
//import { useWeb3Auth } from "@/context/Web3Auth";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

import RPC from "../blockchain/utils/ethersRPC";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";

const clientId = "BMEsL757WiC21sqjhBE21UYfEeyUClYCzUtRzNpDW-1Nxwi_t4gRuZxNQF5GiYfW4ybDlVEdmdLFWsjNhZkal9Y"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
}
const web3auth = new Web3Auth(web3AuthOptions);

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
adapters.forEach((adapter: IAdapter<unknown>) => {
  web3auth.configureAdapter(adapter);
});



export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const {web3auth,getAccounts,setLoggedIn} = useWeb3Auth();
  const router = useRouter();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  // useEffect(() => {  
  //   const init = async () => {
  //     try {
  //       await web3auth.initModal();
  //       setProvider(web3auth.provider);

  //       if (web3auth.connected) {
  //         setLoggedIn(true);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   init();
  // }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3AuthOptions: Web3AuthOptions = {
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        };

        const web3authInstance = new Web3Auth(web3AuthOptions);

        // Get default adapters
        const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

        adapters.forEach((adapter) => {
          web3authInstance.configureAdapter(adapter);
        });

        // Initialize Web3Auth modal
        await web3authInstance.initModal();

        setWeb3auth(web3authInstance); // Set web3auth in state

        // If a provider already exists (user is already connected), set it
        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
        }

        if (web3authInstance.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    init();
  }, []);


  const login = async () => {
    if (!web3auth) {
      console.error("Web3Auth is not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };


//   const handleLogin = async () => {
//     if (web3auth) {
//         if (web3auth.connected) {
//             setLoggedIn(true);
//         }

//         await web3auth.connect();

//         const userInfo = await web3auth.getUserInfo();
//         const address: string = await getAccounts();
//         console.log('User info: ', userInfo);
//         console.log('User address: ', address);

//         // Store userInfo and address in local storage
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('userInfo', JSON.stringify(userInfo));
//             localStorage.setItem('address', address);
//         }

//         let _showOnboardingModal = false;

//         try {
//             const serverResponse = await fetch('/api/postLoginFlow', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ address: address, userInfo: userInfo }),
//             });

//             const data = await serverResponse.json();
//             console.log('Server response data: ', data);

//             if (!data.onboarded) {
//                 _showOnboardingModal = true;
//                 router.push(`/dispute`); // Navigate to dashboard with onboarding modal flag
//             } else {
//                 router.push(`/dispute`);
//             }
//             // if (data.onboarded) {
//             //     router.push(`/dashboard?showOnboardingModal=${_showOnboardingModal}`); // Navigate to dashboard with onboarding modal flag
//             // }

//         } catch (error) {
//             console.log('Error: ', error);
//             throw error;
//         }
//     }
// };
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <LogoIcon />
              ShadcnUI/React
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    rel="noreferrer noopener"
                    href="https://github.com/leoMirandaa/shadcn-landing-page.git"
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    Github
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <Button onClick={login}>
              Connect Wallet
            </Button>
            {/* <GitHubLogoIcon className="mr-2 w-5 h-5" /> */}
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
