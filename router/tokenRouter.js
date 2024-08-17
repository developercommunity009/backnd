const express = require('express');
const router = express.Router();
const deployContract = require('../deploy');
const Web3 = require('web3');
const web3 = new Web3();

router.post('/credentials', async (req, res) => {
    const { formData} = req.body;
    const { name, symbol, rawSupply } = formData;
    // console.log(name, symbol, rawSupply);
    const supply = web3.utils.toWei(rawSupply, 'ether'); // 1 million tokens
    console.log(supply);
    try {
        // Call the deployContract function and wait for it to complete
        const deploymentResult = await deployContract(name, symbol, supply);

        // Send a success response with the deployment details
        res.json({
            message: 'Contract deployed successfully',
            transactionHash: deploymentResult.transactionHash,
            contractAddress: deploymentResult.contractAddress
        });
    } catch (error) {
        // Handle any errors during deployment
        console.error('Deployment error:', error);
        res.status(500).json({ message: 'Contract deployment failed', error: error.message });
    }
});

module.exports = router;