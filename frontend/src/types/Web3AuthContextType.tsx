/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { UserInfo, IProvider } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { Dispatch, SetStateAction } from 'react';
import { WalletServicesPlugin } from '@web3auth/wallet-services-plugin';
import { Contract } from 'ethers';

export interface Web3AuthContextDataType {
	loggedIn: boolean;
	web3auth: Web3Auth | null;
	userInfo: Partial<UserInfo> | null;
	setUserInfo: Dispatch<SetStateAction<Partial<UserInfo> | null>>;
	provider: IProvider | null;
	signMessage: (message: string) => Promise<string | undefined>;
	getContract: (contract: any) => Promise<string | Contract | undefined>;
	sendTransaction: () => Promise<void>;
	getAccounts: () => Promise<any>;
	setLoggedIn: Dispatch<SetStateAction<boolean>>;
	walletServicesPlugin: WalletServicesPlugin | null;
	setProvider: Dispatch<SetStateAction<IProvider | null>>;
}
