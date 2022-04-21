const user_controller = require('../controlers/user_Controller');
const router = require('express').Router();

router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.get('/logout',user_controller.logout);
router.get('/test/:uid/:ustr', user_controller.verify_email);

module.exports = router;