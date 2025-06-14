const hre = require("hardhat");

async function main() {
  const AnalysisHistory = await hre.ethers.getContractFactory("AnalysisHistory");
  
  const analysisHistory = await AnalysisHistory.deploy(); // Deploy the contract
  await analysisHistory.waitForDeployment(); // Correct function for ethers v6+

  console.log(`AnalysisHistory deployed at: ${analysisHistory.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
