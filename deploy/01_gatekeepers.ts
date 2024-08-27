import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { GatekeeperContractName } from "../constants";
import { deployContract, verifyContract } from "../deployTS/utils";
import { Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ethers } from "hardhat";

const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const wallet = new Wallet(String(process.env.DEPLOYER_PRIVATE_KEY!));
  const dep = new Deployer(hre, wallet);

  const artifact = await dep.loadArtifact(GatekeeperContractName);
  const args = [] as any[];
  await hre.deployments.deploy(GatekeeperContractName, {
    from: deployer,
    args: args,
    log: true,
    autoMine: true,
  });

  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  const contractInterface = new ethers.Interface(artifact.abi);
  const encodedConstructorArgs = contractInterface.encodeDeploy(args);

  const gatekeeper = await hre.ethers.getContract(
    GatekeeperContractName,
    deployer
  );
  console.log(`The gatekeeper is deployed at ${await gatekeeper.getAddress()}`);
  const address = await gatekeeper.getAddress();

  console.log(`Verifiying......`);

  await verifyContract({
    address,
    contract: fullContractSource,
    constructorArguments: encodedConstructorArgs,
    bytecode: artifact.bytecode
  })
  console.log(`Verified....`);

};

// const deployContracts = async () => {
//   await deployContract(GatekeeperContractName, []);
// }

export default deployContracts;

deployContracts.tags = ["Gatekeeper"];
