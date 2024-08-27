import { Wallet, utils } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";

import { InitialVoiceCreditProxyContractName } from "../constants";

const DEFAULT_INITIAL_VOICE_CREDITS = 99;

import { deployContract, verifyContract } from "../deployTS/utils";
import * as dotenv from "dotenv"

dotenv.config();

// const deployContracts = async () => {
//   const contract = await deployContract("ConstantInitialVoiceCreditProxy", [DEFAULT_INITIAL_VOICE_CREDITS]);
// }



const deployContracts = async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(String(process.env.DEPLOYER_PRIVATE_KEY));
  const { deployer } = await hre.getNamedAccounts();

  const artifact = await hre.artifacts.readArtifact(InitialVoiceCreditProxyContractName);

  const args = [DEFAULT_INITIAL_VOICE_CREDITS];

  await hre.deployments.deploy(InitialVoiceCreditProxyContractName, {
    from: deployer,
    args: args,
    log: true,
    autoMine: true,
  });

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);

  const initialVoiceCreditProxy = await hre.ethers.getContract(InitialVoiceCreditProxyContractName, deployer);
  console.log(`The initial voice credit proxy is deployed at ${await initialVoiceCreditProxy.getAddress()}`);

  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await initialVoiceCreditProxy.getAddress();

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
}

export default deployContracts;

deployContracts.tags = ["InitialVoiceCreditProxy"];