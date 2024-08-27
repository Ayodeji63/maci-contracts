import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployContract, verifyContract } from "../deployTS/utils";
import { Deployer } from "@matterlabs/hardhat-zksync"
import { Provider, Wallet } from "zksync-ethers";
import { artifacts } from "hardhat";
import { ethers } from "ethers";


const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  const artifact = await hre.artifacts.readArtifact("PollFactory");
  const args = [] as any[];

  await hre.deployments.deploy("PollFactory", {
    from: deployer,
    args: args,
    log: true,
    libraries: {
      PoseidonT3: "0x1447872E09b36eB3Bc49cF930c47175Da46139fE",
      PoseidonT4: "0x8Aba44ee35A51c51F271D68c5dc936c529f762BC",
      PoseidonT5: "0xbFcb4f0fa5F3831998408d63882E0f6E2095C49F",
      PoseidonT6: "0x5BfcF5A1b1e0e0D5E1B4d352f8eCF8f29913008D",
    },
    autoMine: true,
  });

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);


  const pollFactory = await hre.ethers.getContract("PollFactory", deployer);

  console.log(
    `The poll factory is deployed at ${await pollFactory.getAddress()}`
  );

  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await pollFactory.getAddress();

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




export default deployContracts;

deployContracts.tags = ["PollFactory"];
