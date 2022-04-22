const user_controller = require('../controlers/user_Controller');
const auth = require('../middleware/auth');
const router = require('express').Router();

router.post('/register', user_controller.register);
router.post('/checkUser', user_controller.checkUserExisted);
router.post('/login', user_controller.login);
router.get('/logout',user_controller.logout);
router.get('/profile', user_controller.profile);
router.get('/test/:uid/:ustr', user_controller.verify_email);

module.exports = router;