'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

import BankApp from './abi/contracts/BankApp.sol/BankApp.json';
import BankToken from './abi/contracts/BankToken.sol/BankToken.json';

const wallets: object[] = [];

window.addEventListener("eip6963:announceProvider", (e) => {
  wallets.push(e.detail.info);
});

window.dispatchEvent(new Event("eip6963:requestProvider"));

console.log("Wallets: ", wallets);

function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [noticeInfo, setNoticeInfo] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  //
  const [trustAccountBalance, setTrustAccountBalance] = useState(0);
  const [flipAccountBalance, setFlipAccountBalance] = useState(0);
  //
  const [inTx, setInTx] = useState(true);
  const [txAmount, setTxAmount] = useState("0");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const bankAppAddress = process.env.NEXT_PUBLIC_CONTRACE_ADDRESS_BANK_APP || ethers.constants.AddressZero;
  const bankTokenAddress = process.env.NEXT_PUBLIC_CONTRACE_ADDRESS_BANK_TOKEN || ethers.constants.AddressZero;

  // console.log(provider);
  // console.log(signer);

  async function initBankAppContract(user: ethers.Signer) {
    console.log('contractAddress: ', bankAppAddress);
    const checked = await provider.getCode(bankAppAddress);
    console.log('contract checked: ', checked);
    const contract = new ethers.Contract(bankAppAddress, BankApp.abi, user);
    return contract;
  }

  async function initBankTokenContract(user: ethers.Signer) {
    // console.log(contractAddress);
    const checked = await provider.getCode(bankTokenAddress);
    // console.log(checked);
    if (checked === '0x') {
      console.error('contract is not deployed');
      return;
    }
    return new ethers.Contract(bankTokenAddress, BankToken.abi, user);
  }

  async function handleConnectWallet() {
    console.log("connectWallet");
    if (window.ethereum !== undefined && window.ethereum.request !== undefined) {
      try {
        setInTx(true);
        const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(address);
        console.log("Connected Wallet Address: ", address);
        await getWalletBalance();
        //
      } catch (error) {
        if (error.code === 4001) {
          setNoticeInfo("Please connect to Wallet.");
        } else {
          console.error(error);
        }
      } finally {
        setInTx(false);
      }
    }
  }

  async function handleDisConnectWallet() {
    console.log("handleDisConnectWallet");
    setWalletAddress(null);
  }

  async function handleBindAccount() {
    const contract = await initBankAppContract(signer);
    if (contract === undefined) {
      console.error('contract is undefined');
      return;
    }
    // call restful api to bind current user to connected wallet.
    // const addreess = await signer.getAddress();
    // const tx = await contract.bindWallet("John", "uid123", addreess);
    // const receipt = await tx.wait();
    // console.log('bindAccount tx: ', receipt);
    //
    await getTrustAccountBalance();
    await getFlipAccountBalance();
  }

  function ShowConnectWalletButton() {
    if (walletAddress) {
      return (
        <>
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={handleDisConnectWallet}
          >
            {walletAddress}
          </button>
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={handleBindAccount}
            disabled={inTx}
          >
            Bind Account
          </button>
        </>
      );
    } else {
      return (
        <button
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </button>
      );
    }
  }

  async function getWalletBalance() {
    signer.getAddress().then((address) => {
      provider.getBalance(address).then((balance) => {
        const eth = ethers.utils.formatEther(balance);
        console.log('getWalletBalance wallet balance: ', balance, eth);
        setWalletBalance(parseInt(eth));
      });
    });
  }

  async function getTrustAccountBalance() {
    const contract = await initBankAppContract(signer);
    if (contract === undefined) {
      console.error('contract is undefined');
      return;
    }
    const address = await signer.getAddress();
    console.log('getTrustAccountBalance address: ', address);
    const amount = await contract.getBalance(address);
    console.log('getTrustAccountBalance amount: ', amount);
    setTrustAccountBalance(parseInt(ethers.utils.formatEther(amount)));
  }

  async function getFlipAccountBalance() {
    console.log("getFlipAccountBalance");
    const contract = await initBankTokenContract(signer);
    if (contract === undefined) {
      console.error('contract is undefined');
      return;
    }
    const address = await signer.getAddress();
    console.log('getFlipAccountBalance address: ', address);
    const amount = await contract.balanceOf(address);
    console.log('getFlipAccountBalance amount: ', amount);
    setFlipAccountBalance(parseInt(ethers.utils.formatEther(amount)));
  }

  async function handleDespoit() {
    try {
      setInTx(true);
      console.log("handleDespoit: ", txAmount, bankAppAddress);
      const tx = await signer.sendTransaction({ to: bankAppAddress, value: ethers.utils.parseEther(txAmount) });
      const receipt = await tx.wait();
      console.log('handleDespoit tx: ', receipt);
      await getWalletBalance();
      await getTrustAccountBalance();
    } catch (error) {
      console.error('handleDespoit error: ', error);
    } finally {
      setInTx(false);
    }
  }

  async function HandleLiqudity() {
    console.log("HandleLiqudity: ", txAmount, bankAppAddress);
    const contract = await initBankTokenContract(signer);
    if (contract === undefined) {
      console.error('HandleLiqudity: contract is undefined');
      return;
    }
    try {
      setInTx(true);
      //TODO: add liquidity
    } catch (error) {
      console.error('HandleLiqudity error: ', error);
    } finally {
      setInTx(false);
    }
  }

  async function handleExchangeToFlip() {
    console.log("handleExchangeToFlip:", txAmount, bankTokenAddress);
    const contract = await initBankAppContract(signer);
    if (contract === undefined) {
      console.error('contract is undefined');
      return;
    }
    try {
      const gasPrice = await provider.getGasPrice();
      console.log('handleExchangeToFlip gasPrice: ', ethers.utils.formatUnits(gasPrice, 'wei'));
      // const gasLimit = await contract.estimateGas.exchangeTokens(ethers.utils.parseEther(txAmount));
      // console.log('handleExchangeToFlip gasLimit: ', gasLimit);
      const tx = await contract.exchangeTokens(ethers.utils.parseEther(txAmount), { gasPrice: gasPrice, gasLimit: 30000000 });
      const receipt = await tx.wait();
      console.log('handleExchangeToFlip tx: ', receipt);
      await getTrustAccountBalance();
      await getFlipAccountBalance();
    } catch (error) {
      console.error('handleExchangeToFlip error: ', error);
    }
  }

  async function handleWithdrawToWallet() {
    console.log("handleWithdrawToWallet:", txAmount, bankAppAddress);
    const contract = await initBankAppContract(signer);
    if (contract === undefined) {
      console.error('contract is undefined');
      return;
    }
    try {
      setInTx(true);
      const tx = await contract.withdrawWallet(ethers.utils.parseEther(txAmount));
      const receipt = await tx.wait();
      console.log('handleWithdrawToWallet tx: ', receipt);
      await getWalletBalance();
      await getTrustAccountBalance();
    } catch (error) {
      console.error('handleWithdrawToWallet error: ', error);
    } finally {
      setInTx(false);
    }
  }

  function toDeadline(expiration: number): number {
    return Math.floor((Date.now() + expiration) / 1000);
  }

  async function getPermitSignature(
    ownerAddress: string,
    sourceAddress: string,
    amount: ethers.BigNumber,
    wallet: ethers.Signer,
    token: any,
    tokenAddress: string) {
    // how long will the signature be valid. in 10 minutes
    const deadline = toDeadline(1000 * 60 * 10);
    const permitTypes = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
    const permitValues = {
      owner: ownerAddress,
      spender: sourceAddress,
      value: amount,
      nonce: await token.nonces(ownerAddress),
      deadline: deadline
    };
    // get chain id
    const chainId = await signer.getChainId();
    const domain = {
      name: await token.name(),
      version: "1",
      chainId: chainId,
      verifyingContract: tokenAddress,
    };
    console.log('getPermitSignature: ', permitValues, domain);
    // generate signature
    const signature = await wallet._signTypedData(domain, permitTypes, permitValues);
    const sign = ethers.utils.splitSignature(signature);
    return { deadline, sign };
  }

  async function handleExchangeToEth() {
    console.log("handleExchangeToEth:", txAmount, bankTokenAddress);
    const contract = await initBankAppContract(signer);
    if (contract === undefined || walletAddress === null) {
      console.error('contract is undefined');
      return;
    }
    const token = await initBankTokenContract(signer);
    try {
      // prepare signature
      const { deadline, sign } = await getPermitSignature(walletAddress, bankAppAddress, ethers.utils.parseEther(txAmount), signer, token, bankTokenAddress);
      console.log('handleExchangeToEth sign: ', sign);
      //
      setInTx(true);
      const tx = await contract.withdrawTokens(ethers.utils.parseEther(txAmount), deadline, sign.v, sign.r, sign.s);
      const receipt = await tx.wait();
      console.log('handleExchangeToEth tx: ', receipt);
      await getTrustAccountBalance();
      await getFlipAccountBalance();
    } catch (error) {
      console.error('handleExchangeToEth error: ', error);
    } finally {
      setInTx(false);
    }
  }

  return (
    console.log("Home: "),
    //
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 flex gap-8 items-center justify-center">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {ShowConnectWalletButton()}
        </div>
      </header>
      <main className="flex flex-col w-full gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {noticeInfo && <p className="text-red-500">{noticeInfo}</p>}
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <span className="text-sm sm:text-base">Wallet Balance: </span>
          <span className="text-sm sm:text-base"> {walletBalance} ETH </span>

          <input
            type="text"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            placeholder="Amount"
            onChange={(e) => setTxAmount(e.target.value)}
          />
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={handleDespoit}
            disabled={inTx}
          >
            Deposit
          </button>
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={HandleLiqudity}
            disabled={inTx}
          >
            Add Liqudity
          </button>

        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <span className="text-sm sm:text-base">Trust Account Balance: </span>
          <span className="text-sm sm:text-base"> {trustAccountBalance} ETH </span>

          <input
            type="text"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            placeholder="Amount"
            onChange={(e) => setTxAmount(e.target.value)}
          />
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={handleExchangeToFlip}
            disabled={inTx}
          >
            Exchange to FLIP
          </button>
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={handleWithdrawToWallet}
          >
            Withdraw to Wallet
          </button>

        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <span className="text-sm sm:text-base">FLIP Account Balance: </span>
          <span className="text-sm sm:text-base"> {flipAccountBalance} FLIP </span>

          <input
            type="text"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            placeholder="Amount"
            onChange={(e) => setTxAmount(e.target.value)}
          />
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={handleExchangeToEth}
            disabled={inTx}
          >
            Exchange to ETH
          </button>

        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}

export default Home;