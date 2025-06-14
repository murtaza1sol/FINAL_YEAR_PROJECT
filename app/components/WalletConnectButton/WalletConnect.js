"use client";

import UserInfoForm from "../UserInfoForm/UserInfoForm";
import DoctorInfoForm from "../DoctorInfoForm/DoctorInfoForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export default function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isNewUser, setIsNewUser] = useState(null); // null: undecided, true: new, false: existing
  const [userRole, setUserRole] = useState(""); // 'patient' or 'doctor'
  const router = useRouter();

  const checkUserExists = async (walletAddress) => {
    const res = await fetch(`/api/check-user?wallet=${walletAddress}`);
    const data = await res.json();
    return data.exists;
  };

  const checkDoctorExists = async (walletAddress) => {
    const res = await fetch(`/api/check-doctor?wallet=${walletAddress}`);
    const data = await res.json();
    return data.exists;
  };

  const connectWallet = async (role) => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];
    setWalletAddress(address);
    setUserRole(role);

    let exists;
    if (role === "patient") {
      exists = await checkUserExists(address);
    } else if (role === "doctor") {
      exists = await checkDoctorExists(address);
    }

    setIsNewUser(!exists);
  };

  useEffect(() => {
    if (walletAddress && userRole === "patient" && isNewUser === false) {
      router.push(`/dashboard?wallet=${walletAddress}`);
    } else if (walletAddress && userRole === "doctor" && isNewUser === false) {
      router.push(`/DoctorDashboardPage?wallet=${walletAddress}`);
    }
  }, [walletAddress, isNewUser]);

  return (
    <div className="p-4">
      <button
        onClick={() => connectWallet("patient")}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl m-4"
      >
        Connect as Patient
      </button>
      <button
        onClick={() => connectWallet("doctor")}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl m-4"
      >
        Connect as Doctor
      </button>

      {walletAddress && (
        <p className="mt-2 text-sm text-gray-700">Connected: {walletAddress}</p>
      )}

      {isNewUser && userRole === "patient" && (
        <div className="mt-4">
          <p className="mb-2 text-gray-700">
            Please enter your patient details:
          </p>
          <UserInfoForm walletAddress={walletAddress} />
        </div>
      )}

      {isNewUser && userRole === "doctor" && (
        <div className="mt-4">
          <p className="mb-2 text-gray-700">
            Please enter your doctor details:
          </p>
          <DoctorInfoForm walletAddress={walletAddress} />
        </div>
      )}
    </div>
  );
}
