import express from 'express'
import { Activate_User, Login_User, Logout_User, Refresh_AccessToken, User_Profile, User_Registration,Update_Profile, Update_Avatar, update_Password } from "../Controller/authuser.controller.js";
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js';
const router = express.Router()


router.route('/register').post(User_Registration)
router.route('/activate-account').post(Activate_User)
router.route('/login').post(Login_User)
router.route('/logout').get(Verify_User,Logout_User)
router.route('/refresh-token').get(Refresh_AccessToken)
router.route('/me').get(Verify_User,User_Profile)   
router.route('/update-profile').post(Verify_User,Update_Profile)
router.route('/update-password').post(Verify_User,update_Password)
router.route('/update-avatar').post(Verify_User,Update_Avatar)


export default router