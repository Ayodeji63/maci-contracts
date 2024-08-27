import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-artifactor";
import { task, subtask } from "hardhat/config";
import "@matterlabs/hardhat-zksync";
import "@matterlabs/hardhat-zksync-verify";
import "@matterlabs/hardhat-zksync-deploy"




/**
 * Allow to copy a direcotry from source to target
 * @param source - the source directory
 * @param target - the target directory
 */

function copyDirectory(source: string, target: string): void {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (!fs.existsSync(source)) {
    return;
  }

  const files = fs.readdirSync(source);

  files.forEach((file: string) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// // Define a subtask to copy artifacts
// subtask("copy-maci-artifacts", async (_, { config }) => {
//   const sourceDir = path.resolve(
//     __dirname,
//     "./node_modules/maci-contracts/build/artifacts/contracts/"
//   );
//   const destDir = path.resolve(
//     config.paths.artifacts,
//     "maci-contracts",
//     "contracts"
//   );

//   copyDirectory(sourceDir, destDir);
// });

// // Override the existing compile task
// task("compile", async (args, hre, runSuper) => {
//   // Before compilation move over artifacts
//   await hre.run("copy-maci-artifacts");

//   // Run the original compile task
//   await runSuper(args);

//   // After compilation, run the subtask to copy MACI artifacts
//   await hre.run("copy-maci-artifacts");
// });

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey =
  process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey =
  process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  defaultNetwork: "zkSyncTestnet",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
      // forking: {
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      //   enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      // },
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia", // or a Sepolia RPC endpoint from Infura/Alchemy/Chainstack etc.
      zksync: true,
      accounts: [deployerPrivateKey],
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
      deployPaths: ["deploy-zk", "deploy"]

    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      zksync: false
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      gas: 40000000,
      gasPrice: 4000000000,
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    pgn: {
      url: "https://rpc.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
    pgnTestnet: {
      url: "https://sepolia.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
  },
  zksolc: {
    version: "latest",
    settings: {
      // compilerPath: "zksolc", // optional. Ignored for compilerSource "docker". Can be used if compiler is located in a specific folder
      libraries: {
        "maci-contracts/contracts/crypto/PoseidonT3.sol": {
          "PoseidonT3": "0x1447872E09b36eB3Bc49cF930c47175Da46139fE"
        },
        "maci-contracts/contracts/crypto/PoseidonT6.sol": {
          "PoseidonT6": "0x5BfcF5A1b1e0e0D5E1B4d352f8eCF8f29913008D"
        },
        "maci-contracts/contracts/crypto/PoseidonT4.sol": {
          "PoseidonT4": "0x8Aba44ee35A51c51F271D68c5dc936c529f762BC"
        },
        "maci-contracts/contracts/crypto/PoseidonT5.sol": {
          "PoseidonT5": "0xbFcb4f0fa5F3831998408d63882E0f6E2095C49F"
        }
      }, // optional. References to non-inlinable libraries
      missingLibrariesPath:
        "./.zksolc-libraries-cache/missingLibraryDependencies.json", // optional. This path serves as a cache that stores all the libraries that are missing or have dependencies on other libraries. A `hardhat-zksync-deploy` plugin uses this cache later to compile and deploy the libraries, especially when the `deploy-zksync:libraries` task is executed
      enableEraVMExtensions: false, // optional.  Enables Yul instructions available only for ZKsync system contracts and libraries
      forceEVMLA: false, // optional. Falls back to EVM legacy assembly if there is a bug with Yul
      optimizer: {
        enabled: true, // optional. True by default
        mode: "3", // optional. 3 by default, z to optimize bytecode size
        fallback_to_optimizing_for_size: false, // optional. Try to recompile with optimizer mode "z" if the bytecode is too large
      },
    },
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    // apiKey: `${etherscanApiKey}`,
    apiKey: {
      arbitrumSepolia: `${etherscanApiKey}`,
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      // apiKey: `${etherscanApiKey}`,
      apiKey: {
        arbitrumSepolia: `${etherscanApiKey}`,
      },
      customChains: [
        {
          network: "arbitrumSepolia",
          chainId: 421614,
          urls: {
            apiURL: "https://api-sepolia.arbiscan.io/api",
            browserURL: "https://sepolia.arbiscan.io/",
          },
        },
      ],
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
