import { Wallet, utils } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployContract } from "./utils";
import * as dotenv from "dotenv"

dotenv.config();

// export default async function (hre:HardhatRuntimeEnvironment) {
//     console.log(`Running deploy script for the libraries`);

//     // Initialize the wallet
//     const wallet = new Wallet(String(process.env.WALLET_PRIVATE_KEY));

//     // Create deployer object and load the artifact of the contract you want to deploy
//     const deployer = new Deployer(hre, wallet);

//     // Deploy your libraries
//     const libraryArtifact = await deployer.loadArtifact("PoseidonT3");
//     const libraryContract = await deployer.deploy(libraryArtifact, [], );

//     console.log(`Library was deployed to ${libraryContract.address}`);

//     return {
//         poseidonT3Address: libraryContract.address,
//     }


// }

export default async () => {
    await deployContract("poseidons", []);
}