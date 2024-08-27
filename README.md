# Hardhat Project: zkSync Integration

This project demonstrates how to use Hardhat with zkSync. It includes a sample contract, a test for that contract, and a Hardhat Ignition module for deployment.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [pnpm](https://pnpm.io/) package manager

## Setup and Usage

Follow these steps to set up and run the project:

1. **Install Dependencies**

   ```shell
   pnpm install
   ```

2. **Compile Contracts**

    **Note:** Do this to avoid compilation errors:
   - Add the zkeys folder.
   - In the `MACI.sol` file, replace `Ownable(msg.sender)` with `Ownable()`, and other files with `Ownable(msg.sender)`.
   - In the same file, comment out the following line:

     ```solidity
     // if (hash2([uint256(1), uint256(1)]) == 0) revert PoseidonHashLibrariesNotLinked();

   Use the hardhat-zksync-plugin to compile the contracts for the zkSync network:
   
   ```shell
   pnpm hardhat compile --network zkSyncTestnet
   ```

   **Note:** If you encounter compilation errors:
   - Add the zkeys folder.
   - In the `MACI.sol` file, replace `Ownable(msg.sender)` with `Ownable()`, and other files with `Ownable(msg.sender)`.
   - In the same file, comment out the following line:
     ```solidity
     // if (hash2([uint256(1), uint256(1)]) == 0) revert PoseidonHashLibrariesNotLinked();
     ```

3. **Deploy Contracts**

   Run the deployment script on the zkSync testnet:

   ```shell
   pnpm hardhat deploy --network zkSyncTestnet
   ```
4. **Errors**
    The `99_generateTsAbis.ts` might not work copy the `MACIWrapper` address and abi from `deployments` folder

## Additional Information

- For more details on Hardhat, visit the [Hardhat documentation](https://hardhat.org/docs).
- To learn about zkSync integration, check the [zkSync documentation](https://v2-docs.zksync.io/dev/).

## Troubleshooting

If you encounter any issues during compilation or deployment, please refer to the zkSync community forums or open an issue in this project's repository.