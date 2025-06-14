"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DoctorDashboardPage() {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [patients, setPatients] = useState([]); // Placeholder for future integration
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("wallet");

  useEffect(() => {
    async function fetchData() {
      if (walletAddress) {
        try {
          const resDoctor = await fetch(`/api/check-doctor?wallet=${walletAddress}`);
          const doctorData = await resDoctor.json();
          setDoctorInfo(doctorData.doctor || null);

          // Future: fetch patient list here
          // const resPatients = await fetch("/api/get-patients");
          // const patientsData = await resPatients.json();
          // setPatients(patientsData);

        } catch (error) {
          console.error("Error fetching doctor dashboard data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchData();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-600 text-sm font-medium">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-10 text-center">
          🩺 Doctor Dashboard
        </h1>

        {doctorInfo ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-4">👨‍⚕️ Doctor Info</h2>
              <div className="space-y-1 text-gray-700">
                <p><strong>Name:</strong> {doctorInfo.name}</p>
                <p><strong>Specialization:</strong> {doctorInfo.specialisation || 'N/A'}</p>
                <p><strong>Hospital Location:</strong> {doctorInfo.hospitalLocation || 'N/A'}</p>
                <p><strong>Wallet Address:</strong> {walletAddress}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-green-700 mb-4">📋 Patients List</h2>
              {patients.length > 0 ? (
                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                  {patients.map((patient, idx) => (
                    <li key={idx}>
                      <p><strong>Name:</strong> {patient.name}</p>
                      <p><strong>Residence:</strong> {patient.residence}</p>
                      <p><strong>Last Visit:</strong> {new Date(patient.lastVisit).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No patients assigned yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-600 font-medium">
            Doctor data not found. Please connect your wallet again.
          </p>
        )}
      </div>
    </div>
  );
}
