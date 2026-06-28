const express  = require('express');
const router   = express.Router();
const {
  getAll, getById, create, update, remove, getStudioGames,
} = require('../controllers/studios.controller');
const auth     = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createStudioSchema, updateStudioSchema } = require('../schemas/studio.schema');

router.get('/:id/games', getStudioGames);         

router.get('/',     getAll);                     
router.get('/:id',  getById);                     

router.post('/',    auth, validate(createStudioSchema), create);    
router.put('/:id',  auth, validate(updateStudioSchema), update);   
router.delete('/:id', auth, remove);                               

module.exports = router;
