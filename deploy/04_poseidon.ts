import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { verifyContract } from "../deployTS/utils";

async function deployPoseidenContract(
  name: "PoseidonT3" | "PoseidonT4" | "PoseidonT5" | "PoseidonT6",
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  const artifact = await hre.artifacts.readArtifact(name);

  const args = [] as any[];


  await hre.deployments.deploy(name, {
    from: deployer,
    args: args,
    log: true,
    autoMine: true,
  });

  const poseidon = await hre.ethers.getContract(name, deployer);
  console.log(`The ${name} is deployed at ${await poseidon.getAddress()}`);

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);


  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await poseidon.getAddress();

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
  return poseidon;
}

const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const poseidonT3 = await deployPoseidenContract("PoseidonT3", hre);
  console.log(`The poseidonT3 is deployed at ${await poseidonT3.getAddress()}`);

  const poseidonT4 = await deployPoseidenContract("PoseidonT4", hre);
  console.log(`The poseidonT4 is deployed at ${await poseidonT4.getAddress()}`);

  const poseidonT5 = await deployPoseidenContract("PoseidonT5", hre);
  console.log(`The poseidonT5 is deployed at ${await poseidonT5.getAddress()}`);

  const poseidonT6 = await deployPoseidenContract("PoseidonT6", hre);
  console.log(`The poseidonT6 is deployed at ${await poseidonT6.getAddress()}`);
};

export default deployContracts;

deployContracts.tags = ["Poseidon"];
