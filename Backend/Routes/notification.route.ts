import express from 'express'
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js'
import { Get_Notifications, Update_Notification, Delete_Notification } from '../Controller/notification.controller.js'
const router = express.Router()

// Admin-only routes
router.route('/get').get(Verify_User, Authorize_Role('admin'), Get_Notifications)
router.route('/update/:id').get(Verify_User, Authorize_Role('admin'), Update_Notification)
router.route('/delete/:id').delete(Verify_User, Authorize_Role('admin'), Delete_Notification)

export default router
