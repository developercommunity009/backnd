require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
// Import handler function
function findImports(importPath) {
    if (importPath.startsWith('@openzeppelin/')) {
        const resolvedPath = path.resolve(__dirname, 'node_modules', importPath);
        return {
            contents: fs.readFileSync(resolvedPath, 'utf8')
        };
    } else {
        return { error: 'File not found' };
    }
}

const compileContract = () => {
    try {
        const source = fs.readFileSync('ERC20.sol', 'utf8');
        const input = {
            language: 'Solidity',
            sources: {
                'ERC20.sol': {
                    content: source,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode'],
                    },
                },
            },
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

         console.log('Compilation output:', JSON.stringify(output, null, 2));

         if (!output.contracts || !output.contracts['ERC20.sol'] || !output.contracts['ERC20.sol'].MyToken) {
            throw new Error("Contract compilation failed or contract not found in the output.");
        }

        const contract = output.contracts['ERC20.sol'].MyToken;
        return contract;
    } catch (error) {
        console.error('Compilation error:', error);
        throw error;
    }
};

// for deploy token
const deployContract = async (name, symbol, supply) => {
    try {
        const contract = compileContract();
        const { abi, evm } = contract;

        const tokenContract = new web3.eth.Contract(abi);
        const deployTx = tokenContract.deploy({
            data: evm.bytecode.object,
            arguments: [name, symbol, supply],
        });

        const options = {
            data: deployTx.encodeABI(),
            gas: await deployTx.estimateGas({ from: account.address }),
        };

        const signedTx = await web3.eth.accounts.signTransaction(options, process.env.PRIVATE_KEY);

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('transactionHash', (hash) => {
                // console.log('Transaction hash:', hash);
            });

        // console.log('Contract deployed at address:', receipt.contractAddress);

        return {
            transactionHash: receipt.transactionHash,
            contractAddress: receipt.contractAddress
        };
    } catch (error) {
        console.error('Deployment error:', error);
        throw error;
    }
};

module.exports = deployContract;