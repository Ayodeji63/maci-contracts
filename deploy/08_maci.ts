import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  GatekeeperContractName,
  InitialVoiceCreditProxyContractName,
  TopupCreditContractName,
  stateTreeDepth,
} from "../constants";
import { MACIWrapper, SignUpGatekeeper } from "../typechain-types";
import { Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { deployContract, verifyContract } from "../deployTS/utils";
import * as ethers from 'ethers';


const STATE_TREE_SUBDEPTH = 2;

import fs from "fs"
import path from "path"
import { override } from "prompt";


const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  const poseidonT3 = await hre.ethers.getContract("PoseidonT3", deployer);
  const poseidonT4 = await hre.ethers.getContract("PoseidonT4", deployer);
  const poseidonT5 = await hre.ethers.getContract("PoseidonT5", deployer);
  const poseidonT6 = await hre.ethers.getContract("PoseidonT6", deployer);
  const initialVoiceCreditProxy = await hre.ethers.getContract(InitialVoiceCreditProxyContractName, deployer);
  const gatekeeper = await hre.ethers.getContract<SignUpGatekeeper>(GatekeeperContractName, deployer);
  const topupCredit = await hre.ethers.getContract(TopupCreditContractName, deployer);
  const pollFactory = await hre.ethers.getContract("PollFactory", deployer);
  const messageProcessorFactory = await hre.ethers.getContract("MessageProcessorFactory", deployer);
  const tallyFactory = await hre.ethers.getContract("TallyFactory", deployer);

  const artifact = await hre.artifacts.readArtifact("MACIWrapper");

  const args = [
    await pollFactory.getAddress(),
    await messageProcessorFactory.getAddress(),
    await tallyFactory.getAddress(),
    await gatekeeper.getAddress(),
    await initialVoiceCreditProxy.getAddress(),
    await topupCredit.getAddress(),
    stateTreeDepth,
  ];

  await hre.deployments.deploy("MACIWrapper", {
    from: deployer,
    args: args,
    log: true,
    libraries: {
      PoseidonT3: await poseidonT3.getAddress(),
      PoseidonT4: await poseidonT4.getAddress(),
      PoseidonT5: await poseidonT5.getAddress(),
      PoseidonT6: await poseidonT6.getAddress(),
    },
    gasLimit: 100000000,
  });

  const maci = await hre.ethers.getContract<MACIWrapper>(
    "MACIWrapper",
    deployer
  );

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);

  console.log(`The MACI contract is deployed at ${await maci.getAddress()}`);


  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const address = await maci.getAddress();

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


  const tx = await gatekeeper.setMaciInstance(await maci.getAddress());
  await tx.wait(1);
  console.log(`Done`);

};

export default deployContracts;

deployContracts.tags = ["MACI"];
