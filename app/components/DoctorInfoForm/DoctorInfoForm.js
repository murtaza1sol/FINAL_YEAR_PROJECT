"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/DecentralizedHealthSystem";

export default function DoctorInfoForm({ walletAddress, onRegistered }) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.ethereum) return alert("MetaMask required");

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.registerDoctor(name, specialization, hospitalLocation);
      await tx.wait();

      alert("Doctor registered on-chain!");
      onRegistered?.();
      router.push(`/DoctorDashboardPage?wallet=${walletAddress}`);
    } catch (err) {
      console.error(err);
      alert(err.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <input
        type="text"
        placeholder="Name"
        value={name}
        disabled={loading}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Specialization"
        value={specialization}
        disabled={loading}
        onChange={(e) => setSpecialization(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Hospital Location"
        value={hospitalLocation}
        disabled={loading}
        onChange={(e) => setHospitalLocation(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded-xl text-white ${loading ? "bg-gray-400" : "bg-green-600"}`}
      >
        {loading ? "Registering..." : "Register as Doctor"}
      </button>
    </form>
  );
}
