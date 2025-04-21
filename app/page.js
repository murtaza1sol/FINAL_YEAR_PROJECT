import WalletConnect from "./components/WalletConnectButton/WalletConnect";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center items-center font-bold border-black p-7">
       
        <h1 className="text-3xl font-bold text-gray-700 mb-4 ">AI-Based Health Monitoring</h1>
        <div className="mx-auto my-auto justify-items-center">
          <WalletConnect/>
          </div>
      </div>
    </main>
  );
}
