const user_controller = require('../controlers/user_Controller');
const auth = require('../middleware/auth');
const router = require('express').Router();

router.post('/register', user_controller.register);
router.get('/verify/:uid/:ustr', user_controller.verify_email);
router.get('/refresh_token', user_controller.refresh_token);
router.post('/checkUser', user_controller.checkUserExisted);
router.post('/login', user_controller.login);
router.get('/logout',user_controller.logout);
router.get('/profile', auth, user_controller.profile);
router.post('/update', auth, user_controller.update_user);
router.get('/getall', user_controller.get_all);

module.exports = router;