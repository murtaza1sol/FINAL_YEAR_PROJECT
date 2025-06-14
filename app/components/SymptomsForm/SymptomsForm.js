// 'use client';

// import { useState } from "react";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS, ABI } from "@/constants/AnalysisHistory";

// const BASEURI = "http://127.0.0.1:5000";

// export default function SymptomsForm({ walletAddress, name, residence }) {
//   const [symptoms, setSymptoms] = useState({
//     systemicIllness: 0,
//     rectalPain: false,
//     soreThroat: false,
//     penileOedema: false,
//     oralLesions: false,
//     solitaryLesion: false,
//     swollenTonsils: false,
//     hivInfection: false,
//     sexuallyTransmittedInfection: false,
//   });

//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSymptoms({
//       ...symptoms,
//       [name]: type === "checkbox" ? checked : parseInt(value),
//     });
//   };

//   const mapSymptomsKeys = (symptoms) => ({
//     "Systemic Illness": symptoms.systemicIllness,
//     "Rectal Pain": symptoms.rectalPain,
//     "Sore Throat": symptoms.soreThroat,
//     "Penile Oedema": symptoms.penileOedema,
//     "Oral Lesions": symptoms.oralLesions,
//     "Solitary Lesion": symptoms.solitaryLesion,
//     "Swollen Tonsils": symptoms.swollenTonsils,
//     "HIV Infection": symptoms.hivInfection,
//     "Sexually Transmitted Infection": symptoms.sexuallyTransmittedInfection,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);

//     try {
//       const formattedSymptoms = mapSymptomsKeys(symptoms);

//       // 📡 Step 1: Get prediction from Flask
//       const response = await fetch(`${BASEURI}/predict`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ symptoms: formattedSymptoms }),
//       });

//       const data = await response.json();
//       const prediction = data.result;
//       setResult(prediction);

//       // ⛓️ Step 2: Interact with smart contract
//       if (!window.ethereum) {
//         throw new Error("MetaMask is not installed.");
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

//       const tx = await contract.addAnalysis(name, residence, prediction);
//       await tx.wait();

//       console.log("✅ Analysis stored on-chain.");

//     } catch (err) {
//       console.error("❌ Error during prediction or on-chain storage:", err);
//       setError("❌ " + (err.message || "Something went wrong."));
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="flex items-center space-x-2 text-gray-700">
//             <label htmlFor="systemicIllness">Systemic Illness</label>
//             <select
//               name="systemicIllness"
//               value={symptoms.systemicIllness}
//               onChange={handleChange}
//               className="border rounded px-2 py-1"
//             >
//               <option value={0}>None</option>
//               <option value={1}>Fever</option>
//               <option value={2}>Swollen Lymph Nodes</option>
//               <option value={3}>Muscle Aches and Pain</option>
//             </select>
//           </div>

//           {/* Dynamic checkboxes */}
//           {Object.keys(symptoms).map(
//             (key) =>
//               key !== "systemicIllness" && (
//                 <div key={key} className="flex items-center space-x-2 text-gray-700">
//                   <input
//                     type="checkbox"
//                     name={key}
//                     checked={symptoms[key]}
//                     onChange={handleChange}
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                   />
//                   <label className="capitalize">
//                     {key.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                 </div>
//               )
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition duration-200"
//         >
//           Submit Symptoms
//         </button>
//       </form>

//       {/* Prediction Result */}
//       {result && (
//         <div className={`mt-6 p-4 border rounded ${result === "Positive for monkeypox"
//           ? "bg-red-100 border-red-400 text-red-700"
//           : "bg-green-100 border-green-400 text-green-700"}`}>
//           🧪 Prediction: <strong>{result}</strong>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "@/constants/AnalysisHistory";

const BASEURI = "http://127.0.0.1:5000";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSymptoms({
      ...symptoms,
      [name]: type === "checkbox" ? checked : parseInt(value),
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

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

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.addAnalysis(name, residence, prediction);
      await tx.wait();

      console.log("✅ Analysis stored on-chain.");

      // ✅ Refresh analysis history on parent component
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error("❌ Error during prediction or on-chain storage:", err);
      setError("❌ " + (err.message || "Something went wrong."));
    }
  };

  return (
    <>
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

          {Object.keys(symptoms).map(
            (key) =>
              key !== "systemicIllness" && (
                <div
                  key={key}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={symptoms[key]}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <label className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                </div>
              )
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition duration-200"
        >
          Submit Symptoms
        </button>
      </form>

      {result && (
        <div
          className={`mt-6 p-4 border rounded ${
            result === "Positive for monkeypox"
              ? "bg-red-100 border-red-400 text-red-700"
              : "bg-green-100 border-green-400 text-green-700"
          }`}
        >
          🧪 Prediction: <strong>{result}</strong>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </>
  );
}
