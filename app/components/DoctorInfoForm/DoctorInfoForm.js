"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorInfoForm({ walletAddress }) {
  const [name, setName] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/save-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          name,
          specialisation,
          hospitalLocation,
        }),
      });

      if (res.ok) {
        alert("Doctor info saved successfully!");
        router.push(`/DoctorDashboardPage?wallet=${walletAddress}`);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-black max-w-md mx-auto"
    >
      <input
        type="text"
        placeholder="Your Name"
        className="border p-2 rounded w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Specialisation"
        className="border p-2 rounded w-full"
        value={specialisation}
        onChange={(e) => setSpecialisation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Hospital Location"
        className="border p-2 rounded w-full"
        value={hospitalLocation}
        onChange={(e) => setHospitalLocation(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className={`${
          submitting ? "bg-gray-400" : "bg-green-600"
        } text-white px-4 py-2 rounded-xl w-full`}
      >
        {submitting ? "Saving..." : "Save Info"}
      </button>
    </form>
  );
}
