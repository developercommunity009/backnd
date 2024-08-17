



// router/walletRoutes.js
const express = require('express');
const { protect } = require('../controllers/authController');
const {  getWalletById, updateWallet, deleteWallet,generateWallets, getWalletsByUserId, enableTradingAndBuyToken  } = require('../controllers/walletController');
const { transferToken, sellToken } = require('../controllers/sellAndTransfer');


const router = express.Router();

// Wallet routes
router.post('/generate-wallets', protect, generateWallets);
router.post('/enable-trading', protect, enableTradingAndBuyToken);
router.post('/transfer-token', protect, transferToken);
router.post('/sell-token', protect, sellToken);
router.get('/',    protect, getWalletsByUserId);
router.get('/:id', protect, getWalletById);
router.put('/:id', protect, updateWallet);
router.delete('/:id', protect, deleteWallet);


module.exports = router;
