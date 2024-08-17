
// Import Web3 library
const Web3 = require('web3');
require('dotenv').config();

// Initialize Web3 instance with an Ethereum node provider (e.g., Infura)
const web3 = new Web3(process.env.RPC_URL);
function createWallet() {
    const account = web3.eth.accounts.create();
    const privateKey = account.privateKey;
    const publicAddress = account.address;

    return { privateKey, publicAddress };
}

// Function to check the ETH balance of a given address
async function checkEthBalance(address) {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        return balanceEth;
    } catch (error) {
        console.error('Error checking balance:', error);
        throw error;
    }
}

module.exports = {
    createWallet,
    checkEthBalance,
};
