"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/DecentralizedHealthSystem";
import SymptomsForm from "../components/SymptomsForm/SymptomsForm";

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("wallet");

  const fetchDashboardData = async () => {
    if (!walletAddress || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const data = await contract.getHistory(walletAddress);
      if (!data || !data) {
        setUserInfo(null);
      } else {
        setUserInfo({
          name: data[0][1],
          residence: data[0][2],
        });
      }

      const history = await contract.getHistory(walletAddress);
      const parsed = history.map((entry) => ({
        name: entry.name,
        residence: entry.residence,
        result: entry.result,
        timestamp: Number(entry.timestamp) * 1000,
        patientWallet : entry.patientWallet
      }));

      setAnalysisHistory(parsed.reverse());
    } catch (err) {
      console.error("Error loading dashboard:", err);
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
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 text-sm font-medium mt-2">Loading dashboard...</p>
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
                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                  {analysisHistory.map((entry, idx) => (
                    <li key={idx} className="border-b pb-2">
                      <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                      <p><strong>Name:</strong> {entry.name}</p>
                      <p><strong>Residence:</strong> {entry.residence}</p>
                      <p><strong>Result:</strong> {entry.result}</p>
                      <p><strong>wallet Address:</strong> {entry.patientWallet}</p>
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
            User data not found on-chain. Please register first.
          </p>
        )}
      </div>
    </div>
  );
}
