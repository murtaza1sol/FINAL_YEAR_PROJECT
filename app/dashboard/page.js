"use client";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/AnalysisHistory";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SymptomsForm from "../components/SymptomsForm/SymptomsForm";

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("wallet");

  const fetchDashboardData = async () => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user info from backend
      const resUser = await fetch(`/api/check-user?wallet=${walletAddress}`);
      const userData = await resUser.json();
      setUserInfo(userData.user || null);

      // Fetch on-chain history
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        const data = await contract.getHistory(walletAddress);
        const parsed = data.map((entry) => ({
          name: entry.name,
          residence: entry.residence,
          result: entry.result,
          timestamp: Number(entry.timestamp) * 1000,
        }));

        setAnalysisHistory(parsed.reverse());
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-10 text-center">
          🧬 MonkeyPox AI Health Dashboard
        </h1>

        {userInfo ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">👤 User Info</h2>
              <div className="space-y-1 text-gray-700">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Residence:</strong> {userInfo.residence}</p>
                <p><strong>Wallet Address:</strong> {walletAddress}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">📝 Enter Symptoms</h2>
              <SymptomsForm
                walletAddress={walletAddress}
                name={userInfo.name}
                residence={userInfo.residence}
                onSubmitSuccess={fetchDashboardData}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">📊 Previous Analysis</h2>
              {analysisHistory.length > 0 ? (
                <ul className="list-disc pl-6 space-y-3 text-gray-700 ">
                  {analysisHistory.map((entry, idx) => (
                    <li key={idx} className="border-b-2 p-2">
                      <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                      <p><strong>Name:</strong> {entry.name}</p>
                      <p><strong>Residence:</strong> {entry.residence}</p>
                      <p><strong>Result:</strong> {entry.result}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No previous analysis found.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-600 font-medium">
            User data not found. Please connect your wallet again.
          </p>
        )}
      </div>
    </div>
  );
}
