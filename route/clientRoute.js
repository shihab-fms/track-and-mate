const express = require('express');

const clientsController = require('../controller/clientsController');

const router = express.Router();

router.route('/create').post(clientsController.CreateClinets);
router.route('/updateClient/:id').patch(clientsController.updateClinet);
router.route('/getClient/:id').get(clientsController.getClient);
router.route('/getallclients').get(clientsController.getAll);
router.route('/deleteOne/:id').delete(clientsController.deleteOne);

module.exports = router;
