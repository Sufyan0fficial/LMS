import express from 'express'
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js'
import { Course_Analytics, Order_Analytics, User_Analytics } from '../Controller/analytics.controller.js'
const router = express.Router()

// Admin-only routes
router.route('/user').get(Verify_User, Authorize_Role('admin'), User_Analytics)
router.route('/course').get(Verify_User, Authorize_Role('admin'), Course_Analytics)
router.route('/order').get(Verify_User, Authorize_Role('admin'), Order_Analytics)

export default router