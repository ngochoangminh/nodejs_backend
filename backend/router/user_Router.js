const userController = require('../controlers/user_Controller');
const router = require('express').Router();
var jsonParser = require('body-parser').json();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout',userController.logout)


module.exports = router;