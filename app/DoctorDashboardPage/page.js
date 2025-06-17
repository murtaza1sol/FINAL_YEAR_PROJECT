"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/DecentralizedHealthSystem";

export default function DoctorDashboardPage() {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("wallet");

  const fetchDoctorDashboard = async () => {
    if (!walletAddress || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const doc = await contract.doctors(walletAddress);
      setDoctorInfo({
        name: doc.name,
        specialization: doc.specialization,
        hospitalLocation: doc.hospitalLocation
      });

      const patientEntries = await contract.getPatientsByDoctor(walletAddress);
      setPatients(patientEntries.map((p, idx) => ({
        index: idx,
        name: p.name,
        residence: p.residence,
        timestamp: Number(p.timestamp) * 1000
      })).reverse());
    } catch (err) {
      console.error("Error fetching doctor dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (index) => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.deletePatient(index);
      await tx.wait();
      console.log(`✅ Patient at index ${index} deleted`);
      await fetchDoctorDashboard(); // Refresh after deletion
    } catch (err) {
      console.error("❌ Failed to delete patient:", err.message);
    }
  };

  useEffect(() => {
    fetchDoctorDashboard();
  }, [walletAddress]);

  // ⏱ Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDoctorDashboard();
    }, 10000); // 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-green-600 text-sm font-medium mt-2">Loading doctor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-10 text-center">🩺 Doctor Dashboard</h1>

        {doctorInfo ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-4">👨‍⚕️ Doctor Info</h2>
              <div className="space-y-1 text-gray-700">
                <p><strong>Name:</strong> {doctorInfo.name}</p>
                <p><strong>Specialisation:</strong> {doctorInfo.specialization}</p>
                <p><strong>Hospital Location:</strong> {doctorInfo.hospitalLocation}</p>
                <p><strong>Wallet Address:</strong> {walletAddress}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-4">📋 Patients with Analysis</h2>
              {patients.length > 0 ? (
                <ul className="space-y-6 text-gray-700">
                  {patients.map((p, idx) => (
                    <li key={idx} className="border-b pb-4">
                      <p><strong>Name:</strong> {p.name}</p>
                      <p><strong>Residence:</strong> {p.residence}</p>
                      <p><strong>Result:</strong> Positive for Monkeypox</p>
                      <p><strong>Timestamp:</strong> {new Date(p.timestamp).toLocaleString()}</p>

                      <button
                        onClick={() => deletePatient(p.index)}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded"
                      >
                        🗑 Delete Entry
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No patients available yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-600 font-medium">
            Doctor data not found on-chain. Please register first.
          </p>
        )}
      </div>
    </div>
  );
}
