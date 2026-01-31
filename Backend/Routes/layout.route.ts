import express from 'express'
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js'
import { Create_Layout, Get_LayoutBy_Type, Update_Layout } from '../Controller/layout.controller.js'
const router = express.Router()

// Admin-only routes
router.route('/create').post(Verify_User, Authorize_Role('admin'), Create_Layout)
router.route('/update').patch(Verify_User, Authorize_Role('admin'), Update_Layout)

// Public route
router.route('/get-layout').post(Get_LayoutBy_Type)

export default router