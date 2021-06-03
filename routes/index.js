/*!
 * Copyright � 2020, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let express = require('express');
let router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index_shop.html'));
});
/* GET insights page. */
router.get('/ecalico', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index_shop.html'));
});

/* GET entities page. */
router.get('/img', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/img/reddress.jpg'));
});

module.exports = router;
