import express from 'express'
import { Activate_User, Login_User, Admin_Login, Logout_User, Refresh_AccessToken, User_Profile, User_Registration,Update_Profile, Update_Avatar, update_Password, Get_All_Users, Update_User_Role, Delete_User, Resend_VerificationCode, Forget_Password, Reset_Password, Social_Oauth, Get_Enrolled_Courses } from "../Controller/authuser.controller.js";
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js';
const router = express.Router()

// Public routes
router.route('/register').post(User_Registration)
router.route('/activate-account').post(Activate_User)
router.route('/resend-code').post(Resend_VerificationCode)
router.route('/login').post(Login_User)
router.route('/admin-login').post(Admin_Login)
router.route('/social-oauth').post(Social_Oauth)
router.route('/forget-password').post(Forget_Password)
router.route('/reset-password').post(Reset_Password)
router.route('/refresh-token').get(Refresh_AccessToken)

// Authenticated user routes
router.route('/logout').get(Verify_User, Logout_User)
router.route('/me').get(Verify_User, User_Profile)   
router.route('/enrolled-courses').get(Verify_User, Get_Enrolled_Courses)   
router.route('/update-profile').post(Verify_User, Update_Profile)
router.route('/update-password').patch(Verify_User, update_Password)
router.route('/update-avatar').patch(Verify_User, Update_Avatar)

// Admin-only routes
router.route('/get-all-users').get(Verify_User, Authorize_Role('admin'), Get_All_Users)
router.route('/update-role').patch(Verify_User, Authorize_Role('admin'), Update_User_Role)
router.route('/delete-user/:id').delete(Verify_User, Authorize_Role('admin'), Delete_User)

export default router