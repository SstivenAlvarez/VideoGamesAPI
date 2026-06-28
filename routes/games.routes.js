const express  = require('express');
const router   = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/games.controller');
const auth     = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createGameSchema, updateGameSchema } = require('../schemas/game.schema');

router.get('/',     getAll);                                        
router.get('/:id',  getById);                                      

router.post('/',    auth, validate(createGameSchema), create);       
router.put('/:id',  auth, validate(updateGameSchema), update);     
router.delete('/:id', auth, remove);                                 

module.exports = router;
