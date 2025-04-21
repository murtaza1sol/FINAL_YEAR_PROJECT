"use client";
import UserInfoForm from "../UserInfoForm/UserInfoForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export default function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isNewUser, setIsNewUser] = useState(null);
  const router = useRouter();

  // async function checkIfUserExists(address) {
  //   const res = await fetch(`/api/check-user?wallet=${address}`);
  //   const data = await res.json();
  //   return data.exists;
  // }
  const checkUserExists = async (walletAddress) => {
    const res = await fetch(`/api/check-user?wallet=${walletAddress}`);
    const data = await res.json();
    return data.exists;
  };
  

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);

      const exists = await checkUserExists(address);
      setIsNewUser(!exists);
      console.log(exists);
    } else {
      alert("Please install MetaMask");
    }
  };

  useEffect(() => {
    if (walletAddress && isNewUser === false) {
      router.push(`/dashboard?wallet=${walletAddress}`);

    }
  }, [walletAddress, isNewUser]);

  return (
    <div className="p-4">
      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Connect Wallet
      </button>

      {walletAddress && (
        <p className="mt-2 text-sm text-gray-700">
          Connected: {walletAddress}
        </p>
      )}

      {isNewUser && (
        <div className="mt-4">
          <p className="mb-2 text-gray-700">Please enter your details:</p>
          <UserInfoForm walletAddress={walletAddress} />
        </div>
      )}
    </div>
  );
}

