"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserInfoForm({ walletAddress }) {
  const [name, setName] = useState("");
  const [residence, setResidence] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, name, residence }),
    });

    if (res.ok) {
      alert("Info saved successfully!");
      router.push(`/dashboard?wallet=${walletAddress}`);

    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <input
        type="text"
        placeholder="Your Name"
        className="border p-2 rounded w-full "
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Residence Address"
        className="border p-2 rounded w-full"
        value={residence}
        onChange={(e) => setResidence(e.target.value)}
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-xl">
        Save Info
      </button>
    </form>
  );
}
