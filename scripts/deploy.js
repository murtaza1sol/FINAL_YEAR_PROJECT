const hre = require("hardhat");

async function main() {
  const HealthMonitor = await hre.ethers.getContractFactory("HealthMonitor");
  const healthMonitor = await HealthMonitor.deploy();
  await healthMonitor.deployed();
  console.log("HealthMonitor deployed to:", healthMonitor.address);

  const AnalysisHistory = await hre.ethers.getContractFactory("AnalysisHistory");
  const analysisHistory = await AnalysisHistory.deploy();
  await analysisHistory.deployed();
  console.log("AnalysisHistory deployed to:", analysisHistory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
