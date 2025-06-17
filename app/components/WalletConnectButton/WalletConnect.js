"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/DecentralizedHealthSystem";
import DoctorInfoForm from "../DoctorInfoForm/DoctorInfoForm";
import UserInfoForm from "../UserInfoForm/UserInfoForm";

export default function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isNewUser, setIsNewUser] = useState(null); // true | false | null
  const [userRole, setUserRole] = useState(""); // "doctor" | "patient"
  const router = useRouter();

  const connectWallet = async (role) => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    setUserRole(role);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    if (role === "doctor") {
      const doctors = await contract.getAllDoctors();
      const exists = doctors.some((d) => d.wallet.toLowerCase() === address.toLowerCase());
      setIsNewUser(!exists);
    } else {
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const history = await contractWithSigner.getHistory(address);
      setIsNewUser(history.length === 0); // No history means new patient
    }
  };

  useEffect(() => {
    if (!walletAddress || isNewUser === null) return;

    if (!isNewUser) {
      if (userRole === "doctor") {
        router.push(`/DoctorDashboardPage?wallet=${walletAddress}`);
      } else if (userRole === "patient") {
        router.push(`/dashboard?wallet=${walletAddress}`);
      }
    }
  }, [walletAddress, isNewUser, userRole, router]);

  return (
    <div className="p-4">
      <button
        onClick={() => connectWallet("patient")}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl m-2"
      >
        Connect as Patient
      </button>
      <button
        onClick={() => connectWallet("doctor")}
        className="bg-green-600 text-white px-4 py-2 rounded-xl m-2"
      >
        Connect as Doctor
      </button>

      {walletAddress && (
        <p className="mt-2 text-sm text-gray-700">Connected: {walletAddress}</p>
      )}

      {isNewUser && userRole === "patient" && (
        <div className="mt-4">
          <p className="mb-2">Please enter your details:</p>
          <UserInfoForm walletAddress={walletAddress} />
        </div>
      )}

      {isNewUser && userRole === "doctor" && (
        <div className="mt-4">
          <p className="mb-2">Please enter your doctor details:</p>
          <DoctorInfoForm walletAddress={walletAddress} onRegistered={() => setIsNewUser(false)} />
        </div>
      )}
    </div>
  );
}
