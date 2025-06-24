'use client';

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/DecentralizedHealthSystem";

const BASEURI = "https://web-production-0982.up.railway.app/";

export default function SymptomsForm({
  walletAddress,
  name,
  residence,
  onSubmitSuccess,
}) {
  const [symptoms, setSymptoms] = useState({
    systemicIllness: 0,
    rectalPain: false,
    soreThroat: false,
    penileOedema: false,
    oralLesions: false,
    solitaryLesion: false,
    swollenTonsils: false,
    hivInfection: false,
    sexuallyTransmittedInfection: false,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [analysisStored, setAnalysisStored] = useState(false);
  const [reportSent, setReportSent] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSymptoms((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseInt(value),
    }));
  };

  const mapSymptomsKeys = (symptoms) => ({
    "Systemic Illness": symptoms.systemicIllness,
    "Rectal Pain": symptoms.rectalPain,
    "Sore Throat": symptoms.soreThroat,
    "Penile Oedema": symptoms.penileOedema,
    "Oral Lesions": symptoms.oralLesions,
    "Solitary Lesion": symptoms.solitaryLesion,
    "Swollen Tonsils": symptoms.swollenTonsils,
    "HIV Infection": symptoms.hivInfection,
    "Sexually Transmitted Infection": symptoms.sexuallyTransmittedInfection,
  });

  const fetchDoctors = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const allDoctors = await contract.getAllDoctors();
    setDoctors(allDoctors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setAnalysisStored(false);
    setReportSent(null);

    try {
      const formattedSymptoms = mapSymptomsKeys(symptoms);

      const response = await fetch(`${BASEURI}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: formattedSymptoms }),
      });

      const data = await response.json();
      const prediction = data.result;
      setResult(prediction);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.addAnalysis(name, residence, prediction);
      await tx.wait();
      setAnalysisStored(true);
      console.log("✅ Analysis stored on-chain.");

      if (prediction === "Positive for Monkeypox") {
        await fetchDoctors();
      }

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error("❌ Error:", err);
      setError("❌ " + (err.message || "Something went wrong."));
    }
  };

  const handleSendReport = async (doctorAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.addPatient(name, residence, doctorAddress);
      await tx.wait();
      setReportSent(doctorAddress);
      alert("✅ Report sent to doctor.");
    } catch (err) {
      console.error("❌ Failed to send report to doctor:", err);
      setError("❌ Could not notify the doctor.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <label htmlFor="systemicIllness">Systemic Illness</label>
            <select
              name="systemicIllness"
              value={symptoms.systemicIllness}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            >
              <option value={0}>None</option>
              <option value={1}>Fever</option>
              <option value={2}>Swollen Lymph Nodes</option>
              <option value={3}>Muscle Aches and Pain</option>
            </select>
          </div>

          {Object.keys(symptoms).map((key) =>
            key !== "systemicIllness" ? (
              <div key={key} className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name={key}
                  checked={symptoms[key]}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
              </div>
            ) : null
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition duration-200 mt-4"
        >
          Submit Symptoms
        </button>
      </form>

      {result && (
        <div
          className={`p-4 border rounded ${
            result === "Positive for Monkeypox"
              ? "bg-red-100 border-red-400 text-red-700"
              : "bg-green-100 border-green-400 text-green-700"
          }`}
        >
          🧪 Prediction: <strong>{result}</strong>
        </div>
      )}

      {/* Show Doctor Cards */}
      {result === "Positive for Monkeypox" && analysisStored && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Notify a doctor in your area:
    </h3>

    {doctors.length === 0 ? (
      <p className="text-red-600 font-semibold">
        ⚠️ No doctor available in your region.
      </p>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.slice(0, visibleCount).map((doc, index) => (
            <div
              key={index}
              className="bg-white rounded shadow-md border p-4 space-y-2"
            >
              <p className="text-lg font-bold text-blue-700">Dr. {doc.name}</p>
              <p className="text-gray-700 text-sm">Specialization: {doc.specialization}</p>
              <p className="text-gray-600 text-sm">Location: {doc.hospitalLocation}</p>
              <p className="text-gray-400 text-xs truncate">Wallet: {doc.wallet}</p>
              <button
                className={`mt-2 w-full rounded px-3 py-1 text-white font-medium ${
                  reportSent === doc.wallet
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => handleSendReport(doc.wallet)}
                disabled={reportSent === doc.wallet}
              >
                {reportSent === doc.wallet ? "Report Sent" : "Send Report to Doctor"}
              </button>
            </div>
          ))}
        </div>

        {visibleCount < doctors.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="mt-4 text-blue-600 underline"
          >
            See more doctors...
          </button>
        )}
      </>
    )}
  </div>
)}


      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
