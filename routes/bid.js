const express = require('express');
const router = express.Router();
const bidCtrl = require('../controllers/bid');

/**
 * 
 */
router.post('/add', bidCtrl.add);

/**
 * 
 */
router.post('/post_bid/:uuid', bidCtrl.post_bid);


module.exports = router;
