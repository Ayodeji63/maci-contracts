import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VerifierContractName } from "../constants";
import { deployContract, verifyContract } from "../deployTS/utils";
import { ethers } from "hardhat";

const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  const artifact = await hre.artifacts.readArtifact(VerifierContractName);

  const args = [] as any[]

  await hre.deployments.deploy(VerifierContractName, {
    from: deployer,
    args: args,
    log: true,
    autoMine: true,
  });


  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);

  const verifier = await hre.ethers.getContract(VerifierContractName, deployer);
  console.log(`The verifier is deployed at ${await verifier.getAddress()}`);

  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await verifier.getAddress();

  // Log deployment info
  console.log(`\n"${artifact.contractName}" was successfully deployed:`);
  console.log(` - Contract address: ${address}`);
  console.log(` - Contract source: ${fullContractSource}`);
  console.log(` - Encoded constructor arguments: ${encodedConstructorArgs}\n`);

  // Verify the contract
  console.log(`Requesting contract verification...`);
  await verifyContract({
    address,
    contract: fullContractSource,
    constructorArguments: encodedConstructorArgs,
    bytecode: artifact.bytecode,
  });
};

// const deployContracts = async () => {
//   await deployContract(VerifierContractName, []);
// }

export default deployContracts;

deployContracts.tags = ["Verifier"];
