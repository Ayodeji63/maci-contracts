import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployContract, verifyContract } from "../deployTS/utils";
import { utils, Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { ethers } from "hardhat";
const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  const wallet = new Wallet(String(process.env.DEPLOYER_PRIVATE_KEY!));
  const dep = new Deployer(hre, wallet);
  const artifact = await dep.loadArtifact("MessageProcessorFactory");

  const args = [] as any[];
  const contract = await hre.deployments.deploy("MessageProcessorFactory", {
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

  const messageProcessorFactory = await hre.ethers.getContract(
    "MessageProcessorFactory",
    deployer
  );

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);

  console.log(
    `The message processor factory is deployed at ${await messageProcessorFactory.getAddress()}`
  );

  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await messageProcessorFactory.getAddress();

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

deployContracts.tags = ["MessageProcessorFactory"];
