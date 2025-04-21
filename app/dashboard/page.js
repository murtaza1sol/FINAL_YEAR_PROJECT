
// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import SymptomsForm from "../components/SymptomsForm/SymptomsForm";

// export default function DashboardPage() {
//   const [userInfo, setUserInfo] = useState(null);
//   const [analysisHistory, setAnalysisHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const searchParams = useSearchParams();
//   const walletAddress = searchParams.get("wallet");

//   useEffect(() => {
//     async function fetchData() {
//       if (walletAddress) {
//         try {
//           const resUser = await fetch(
//             `/api/check-user?wallet=${walletAddress}`
//           );
//           const userData = await resUser.json();
//           setUserInfo(userData.user || null);

//           // If needed, enable this to fetch analysis history:
//           // const resHistory = await fetch(`/api/history?walletAddress=${walletAddress}`);
//           // const historyData = await resHistory.json();
//           // setAnalysisHistory(historyData.history || []);
//         } catch (error) {
//           console.error("Error fetching dashboard data:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false); // prevent infinite loader if wallet not found
//       }
//     }

//     fetchData();
//   }, [walletAddress]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="flex flex-col items-center space-y-4">
//           <svg
//             className="animate-spin h-10 w-10 text-blue-600"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             />
//           </svg>
//           <p className="text-gray-700 text-sm font-medium">
//             Loading dashboard, please wait...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">MonkeyPox AI Health Dashboard</h1>

//       {userInfo ? (
//         <>
//           <div className="mb-6">
//             <p>
//               <strong>Name:</strong> {userInfo.name}
//             </p>
//             <p>
//               <strong>Residence:</strong> {userInfo.residence}
//             </p>
//             <p>
//               <strong>Wallet Address:</strong> {walletAddress}
//             </p>
//           </div>

//           <div className="mb-8">
//             <h2 className="text-xl font-semibold mb-2">Enter Symptoms</h2>
//             <SymptomsForm walletAddress={walletAddress} />
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-2">Previous Analysis</h2>
//             {analysisHistory.length > 0 ? (
//               <ul className="list-disc pl-5">
//                 {analysisHistory.map((entry, idx) => (
//                   <li key={idx} className="mb-2">
//                     <strong>Date:</strong>{" "}
//                     {new Date(entry.timestamp).toLocaleString()} <br />
//                     <strong>Prediction:</strong> {entry.prediction}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No previous analysis found.</p>
//             )}
//           </div>
//         </>
//       ) : (
//         <p className="text-red-600">
//           User data not found. Please connect your wallet again.
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SymptomsForm from "../components/SymptomsForm/SymptomsForm";

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const walletAddress = searchParams.get("wallet");

  useEffect(() => {
    async function fetchData() {
      if (walletAddress) {
        try {
          const resUser = await fetch(`/api/check-user?wallet=${walletAddress}`);
          const userData = await resUser.json();
          setUserInfo(userData.user || null);

          // Uncomment if using history
          // const resHistory = await fetch(`/api/history?walletAddress=${walletAddress}`);
          // const historyData = await resHistory.json();
          // setAnalysisHistory(historyData.history || []);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
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
              <SymptomsForm walletAddress={walletAddress} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">📊 Previous Analysis</h2>
              {analysisHistory.length > 0 ? (
                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                  {analysisHistory.map((entry, idx) => (
                    <li key={idx}>
                      <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                      <p><strong>Prediction:</strong> {entry.prediction}</p>
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

