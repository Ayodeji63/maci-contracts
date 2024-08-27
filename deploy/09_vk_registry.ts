import { extractVk } from "maci-circuits";
import { VerifyingKey } from "maci-domainobjs";

import type { IVerifyingKeyStruct } from "maci-contracts";
import type { VkRegistry } from "../typechain-types";

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  intStateTreeDepth,
  messageBatchDepth,
  messageTreeDepth,
  processMessagesNonQvZkeyPath,
  processMessagesZkeyPath,
  stateTreeDepth,
  tallyVotesNonQvZkeyPath,
  tallyVotesZkeyPath,
  voteOptionTreeDepth,
} from "../constants";
import { ethers } from "ethers";
import { verifyContract } from "../deployTS/utils";

export enum EMode {
  QV,
  NON_QV,
}

const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  const artifact = await hre.artifacts.readArtifact("VkRegistry");

  const args = [] as any[];

  await hre.deployments.deploy("VkRegistry", {
    from: deployer,
    args: args,
    log: true,
    autoMine: true,
  });

  const vkRegistry = await hre.ethers.getContract<VkRegistry>(
    "VkRegistry",
    deployer
  );
  console.log(
    `The Vk Registry is deployed at ${await vkRegistry.getAddress()}`
  );

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);
  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await vkRegistry.getAddress();

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

  console.log(`Sending tx.....`);

  const [processVk, tallyVk, tallyVkNonQv, processVkNonQv] = await Promise.all([
    extractVk(processMessagesZkeyPath),
    extractVk(tallyVotesZkeyPath),
    extractVk(tallyVotesNonQvZkeyPath),
    extractVk(processMessagesNonQvZkeyPath),
  ]).then((vks) =>
    vks.map((vk: any) => (vk ? VerifyingKey.fromObj(vk as any) : null))
  );

  console.log(`Setting some params`);

  const messageBatchSize = 5 ** messageBatchDepth;
  const processVkParam = processVk!.asContractParam() as IVerifyingKeyStruct;
  const tallyVkParam = tallyVk!.asContractParam() as IVerifyingKeyStruct;
  const tallyVkNonQvParam =
    tallyVkNonQv!.asContractParam() as IVerifyingKeyStruct;
  const processVkNonQvParam =
    processVkNonQv!.asContractParam() as IVerifyingKeyStruct;

  console.log(`Sending Transactions....`);

  const tx = await vkRegistry.setVerifyingKeysBatch(
    stateTreeDepth,
    intStateTreeDepth,
    messageTreeDepth,
    voteOptionTreeDepth,
    messageBatchSize,
    [EMode.QV, EMode.NON_QV],
    [processVkParam, processVkNonQvParam],
    [tallyVkParam, tallyVkNonQvParam]
  );
  await tx.wait(1);
  console.log(`Ending Transactions`);

};

export default deployContracts;

deployContracts.tags = ["VkRegistry"];
