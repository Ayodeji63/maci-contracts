import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployContract, verifyContract } from "./utils";
import { Deployer } from "@matterlabs/hardhat-zksync"
import { Provider, Wallet } from "zksync-ethers";
import { artifacts } from "hardhat";
import "@matterlabs/hardhat-zksync-deploy"


const deployContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();

  await hre.deployments.deploy("PollFactory", {
    from: deployer,
    args: [],
    log: true,
    libraries: {
      PoseidonT3: "0x1447872E09b36eB3Bc49cF930c47175Da46139fE",
      PoseidonT4: "0x8Aba44ee35A51c51F271D68c5dc936c529f762BC",
      PoseidonT5: "0xbFcb4f0fa5F3831998408d63882E0f6E2095C49F",
      PoseidonT6: "0x5BfcF5A1b1e0e0D5E1B4d352f8eCF8f29913008D",
    },
    autoMine: true,
  });

  const pollFactory = await hre.ethers.getContract("PollFactory", deployer);

  console.log(
    `The poll factory is deployed at ${await pollFactory.getAddress()}`
  );
};

// const deployContracts = async () => {
//   await deployContract("PollFactory", []);
//   // }



// const deployContracts = async function (hre: HardhatRuntimeEnvironment) {
//   const log = (message: string) => {
//     console.log(message);
//   };

//   log(`\nStarting deployment process of "PollFactory"...`);

//   const wallet = new Wallet(process.env.DEPLOYER_PRIVATE_KEY!);

//   // Initialize deployer object
//   const deployer = new Deployer(hre, wallet);

//   const pollFactory = await deployer.loadArtifact("PollFactory").catch((error) => {
//     if (error?.message?.includes(`Artifact for contract "PollFactory" not found.`)) {
//       console.error(error.message);
//       throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
//     } else {
//       throw new Error(error);
//     }
//   })

//   log(`Deploying contract`);

//   // Load library artifacts
//   const poseidonT3 = await deployer.loadArtifact("PoseidonT3");
//   const poseidonT4 = await deployer.loadArtifact("PoseidonT4");
//   const poseidonT5 = await deployer.loadArtifact("PoseidonT5");
//   const poseidonT6 = await deployer.loadArtifact("PoseidonT6");

//   // Prepare the constructor arguments
//   const args: any[] = []; // Add constructor arguments here if any

//   // Estimate deployment fee



//   // Deploy the contract
//   const contract = await deployer.deploy(pollFactory, args);


//   const address = await contract.getAddress();
//   const constructorArgs = contract.interface.encodeDeploy([]);
//   const fullContractSource = `${pollFactory.sourceName}:${pollFactory.contractName}`;

//   // Display contract deployment info
//   log(`\n"${pollFactory.contractName}" was successfully deployed:`);
//   log(` - Contract address: ${address}`);
//   log(` - Contract source: ${fullContractSource}`);
//   log(` - Encoded constructor arguments: ${constructorArgs}\n`);

//   console.log(`PollFactory deployed at: ${contract.address}`);

//   console.log(`Requesting contract verification......`);
//   await verifyContract({
//     address,
//     contract: fullContractSource,
//     constructorArguments: constructorArgs,
//     bytecode: pollFactory.bytecode,
//   });


// };



export default deployContracts;

deployContracts.tags = ["PollFactory"];
