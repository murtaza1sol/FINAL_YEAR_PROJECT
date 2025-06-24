"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/DecentralizedHealthSystem";

export default function UserInfoForm({ walletAddress }) {
  const [name, setName] = useState("");
  const [residence, setResidence] = useState("");
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

      const tx = await contract.addAnalysis(name, residence,"(Login Time)");
      await tx.wait();

      alert("Registered Successfully!");
      router.push(`/dashboard?wallet=${walletAddress}`);
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
        placeholder="Your Name"
        value={name}
        disabled={loading}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Residence"
        value={residence}
        disabled={loading}
        onChange={(e) => setResidence(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded-xl text-white ${loading ? "bg-gray-400" : "bg-green-600"}`}
      >
        {loading ? "Please wait..." : "Register as Patient"}
      </button>
    </form>
  );
}
