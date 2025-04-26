// 'use client'
// import { useState } from "react";
// import { toast } from "react-hot-toast"; // Import toast

// const BASEURI = "http://127.0.0.1:5000";

// export default function SymptomsForm() {
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

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       setSymptoms({ ...symptoms, [name]: checked });
//     } else if (type === "select-one") {
//       setSymptoms({ ...symptoms, [name]: parseInt(value) });
//     }
//   };

//   const mapSymptomsKeys = (symptoms) => {
//     return {
//       "Systemic Illness": symptoms.systemicIllness,
//       "Rectal Pain": symptoms.rectalPain,
//       "Sore Throat": symptoms.soreThroat,
//       "Penile Oedema": symptoms.penileOedema,
//       "Oral Lesions": symptoms.oralLesions,
//       "Solitary Lesion": symptoms.solitaryLesion,
//       "Swollen Tonsils": symptoms.swollenTonsils,
//       "HIV Infection": symptoms.hivInfection,
//       "Sexually Transmitted Infection": symptoms.sexuallyTransmittedInfection,
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formattedSymptoms = mapSymptomsKeys(symptoms);

//       const res = await fetch(`${BASEURI}/predict`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ symptoms: formattedSymptoms }),
//       });

//       const data = await res.json();
//       toast.success(`🧪 Prediction: ${data.result}`);
//     } catch (err) {
//       console.error("Prediction failed", err);
//       toast.error("❌ Error predicting MonkeyPox status.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Dropdown for systemicIllness */}
//         <div className="flex items-center space-x-2 text-gray-700">
//           <label htmlFor="systemicIllness">Systemic Illness</label>
//           <select
//             name="systemicIllness"
//             value={symptoms.systemicIllness}
//             onChange={handleChange}
//             className="border rounded px-2 py-1"
//           >
//             <option value={0}>None</option>
//             <option value={1}>Fever</option>
//             <option value={2}>Swollen Lymph Nodes</option>
//             <option value={3}>Muscle Aches and Pain</option>
//           </select>
//         </div>

//         {/* Checkboxes for other symptoms */}
//         {Object.keys(symptoms).map(
//           (symptomKey) =>
//             symptomKey !== "systemicIllness" && (
//               <div key={symptomKey} className="flex items-center space-x-2 text-gray-700">
//                 <input
//                   type="checkbox"
//                   name={symptomKey}
//                   checked={symptoms[symptomKey]}
//                   onChange={handleChange}
//                   className="form-checkbox h-4 w-4 text-blue-600"
//                 />
//                 <label className="capitalize">
//                   {symptomKey.replace(/([A-Z])/g, ' $1')}
//                 </label>
//               </div>
//             )
//         )}
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

'use client'
import { useState } from "react";

const BASEURI = "http://127.0.0.1:5000";

export default function SymptomsForm() {
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

  const [result, setResult] = useState(null); // NEW STATE for prediction result
  const [error, setError] = useState(null);   // NEW STATE for error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSymptoms({ ...symptoms, [name]: checked });
    } else if (type === "select-one") {
      setSymptoms({ ...symptoms, [name]: parseInt(value) });
    }
  };

  const mapSymptomsKeys = (symptoms) => {
    return {
      "Systemic Illness": symptoms.systemicIllness,
      "Rectal Pain": symptoms.rectalPain,
      "Sore Throat": symptoms.soreThroat,
      "Penile Oedema": symptoms.penileOedema,
      "Oral Lesions": symptoms.oralLesions,
      "Solitary Lesion": symptoms.solitaryLesion,
      "Swollen Tonsils": symptoms.swollenTonsils,
      "HIV Infection": symptoms.hivInfection,
      "Sexually Transmitted Infection": symptoms.sexuallyTransmittedInfection,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedSymptoms = mapSymptomsKeys(symptoms);

      const res = await fetch(`${BASEURI}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: formattedSymptoms }),
      });

      const data = await res.json();
      setResult(data.result); // Set the prediction result
      setError(null);         // Clear any previous error
    } catch (err) {
      console.error("Prediction failed", err);
      setError("❌ Error predicting MonkeyPox status.");
      setResult(null);        // Clear any previous result
    }
  };

  return (
    <>
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
                <div key={symptomKey} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    name={symptomKey}
                    checked={symptoms[symptomKey]}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <label className="capitalize">
                    {symptomKey.replace(/([A-Z])/g, ' $1')}
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

      {/* Show the result or error below the form */}
      {result && ( result=="Positive for monkeypox"?
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          🧪 Prediction: <strong>{result}</strong>
        </div>:(
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          🧪 Prediction: <strong>{result}</strong>
        </div>
        )
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </>
  );
}
