const hre = require("hardhat");

async function main() {
  const DecentralizedHealthSystem = await hre.ethers.getContractFactory("DecentralizedHealthSystem");
  
  const decentralizedHealthSystem = await DecentralizedHealthSystem.deploy(); // Deploy the contract
  await decentralizedHealthSystem.waitForDeployment(); // Correct function for ethers v6+

  console.log(`DecentralizedHealthSystem deployed at: ${decentralizedHealthSystem.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
