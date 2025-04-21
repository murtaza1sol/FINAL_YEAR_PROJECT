
// import { useState } from "react";

// export default function SymptomsForm({ walletAddress }) {
//   const [symptoms, setSymptoms] = useState({
//     systemicIllness: "0", // default: "none"
//     rectalPain: false,
//     soreThroat: false,
//     penileOedema: false,
//     oralLesions: false,
//     solitaryLesion: false,
//     swollenTonsils: false,
//     hivInfection: false,
//     sexuallyTransmittedInfection: false,
//   });

//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setSymptoms((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ walletAddress, symptoms }),
//       });

//       const data = await res.json();
//       alert(`🧪 Prediction: ${data.prediction}`);
//     } catch (err) {
//       console.error("Prediction failed", err);
//       alert("❌ Error predicting MonkeyPox status.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* Systemic Illness Dropdown */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Systemic Illness
//           </label>
//           <select
//             name="systemicIllness"
//             value={symptoms.systemicIllness}
//             onChange={handleChange}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
//           >
//             <option value="0">None</option>
//             <option value="1">Fever</option>
//             <option value="2">Swollen Lymph Nodes</option>
//             <option value="3">Muscle Aches and Pain</option>
//           </select>
//         </div>

//         {/* Remaining Symptoms as Checkboxes */}
//         {Object.entries(symptoms).map(([key, value]) => {
//           if (key === "systemicIllness") return null;

//           return (
//             <label
//               key={key}
//               className="flex items-center space-x-2 text-gray-700"
//             >
//               <input
//                 type="checkbox"
//                 name={key}
//                 checked={value}
//                 onChange={handleChange}
//                 className="form-checkbox h-4 w-4 text-blue-600"
//               />
//               <span className="capitalize">
//                 {key.replace(/([A-Z])/g, " $1")}
//               </span>
//             </label>
//           );
//         })}
//       </div>

//       <div className="text-right">
//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition duration-200"
//         >
//           Submit Symptoms
//         </button>
//       </div>
//     </form>
//   );
// }


// import { useState } from "react";

// export default function SymptomsForm({ walletAddress }) {
//   const [symptoms, setSymptoms] = useState({
//     systemicIllness: "none", // Initial value is "none"
//     rectalPain: false,
//     soreThroat: false,
//     penileOedema: false,
//     oralLesions: false,
//     solitaryLesion: false,
//     swollenTonsils: false,
//     hivInfection: false,
//     sexuallyTransmittedInfection: false,
//   });

//   const handleChange = (e) => {
//     setSymptoms({ ...symptoms, [e.target.name]: e.target.value || e.target.checked });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Send symptoms data to the API
//     try {
//       const res = await fetch("/api/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ walletAddress, symptoms }),
//       });

//       const data = await res.json();
//       alert(`🧪 Prediction: ${data.result}`);
//     } catch (err) {
//       console.error("Prediction failed", err);
//       alert("❌ Error predicting MonkeyPox status.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Systemic Illness Dropdown */}
//       <div className="flex items-center space-x-2 text-gray-700">
//         <label htmlFor="systemicIllness" className="capitalize">Systemic Illness:</label>
//         <select
//           name="systemicIllness"
//           value={symptoms.systemicIllness}
//           onChange={handleChange}
//           className="form-select px-4 py-2 border border-gray-300 rounded"
//         >
//           <option value="none">None</option>
//           <option value="fever">Fever</option>
//           <option value="swollenLymphNodes">Swollen Lymph Nodes</option>
//           <option value="muscleAches">Muscle Aches and Pain</option>
//         </select>
//       </div>

//       {/* Other Symptoms Checkboxes */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {Object.keys(symptoms).map((symptomKey) => {
//           if (symptomKey !== "systemicIllness") {
//             return (
//               <label key={symptomKey} className="flex items-center space-x-2 text-gray-700">
//                 <input
//                   type="checkbox"
//                   name={symptomKey}
//                   checked={symptoms[symptomKey]}
//                   onChange={handleChange}
//                   className="form-checkbox h-4 w-4 text-blue-600"
//                 />
//                 <span className="capitalize">{symptomKey.replace(/([A-Z])/g, ' $1')}</span>
//               </label>
//             );
//           }
//           return null;
//         })}
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition duration-200"
//       >
//         Submit Symptoms
//       </button>
//     </form>
//   );
// }


import { useState } from "react";

export default function SymptomsForm({ walletAddress }) {
  const [symptoms, setSymptoms] = useState({
    systemicIllness: 0, // Set default value for dropdown
    rectalPain: false,
    soreThroat: false,
    penileOedema: false,
    oralLesions: false,
    solitaryLesion: false,
    swollenTonsils: false,
    hivInfection: false,
    sexuallyTransmittedInfection: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSymptoms({ ...symptoms, [name]: checked });
    } else if (type === "select-one") {
      setSymptoms({ ...symptoms, [name]: parseInt(value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, symptoms }),
      });

      const data = await res.json();
      alert(`🧪 Prediction: ${data.result}`);
    } catch (err) {
      console.error("Prediction failed", err);
      alert("❌ Error predicting MonkeyPox status.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dropdown for systemicIllness */}
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

        {/* Checkboxes for other symptoms */}
        {Object.keys(symptoms).map(
          (symptomKey) =>
            symptomKey !== "systemicIllness" && (
              <label key={symptomKey} className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name={symptomKey}
                  checked={symptoms[symptomKey]}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="capitalize">{symptomKey.replace(/([A-Z])/g, ' $1')}</span>
              </label>
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
  );
}
