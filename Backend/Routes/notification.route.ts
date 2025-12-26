import express from 'express'
import { Verify_User } from '../MiddleWare/auth.js'
import { Get_Notifications, Update_Notification } from '../Controller/notification.controller.js'
const router = express.Router()
import cron from 'node-cron'
import { NotificationModel } from '../Model/notification.model.js'

router.route('/get').get(Verify_User,Get_Notifications)
router.route('/update/:id').get(Verify_User,Update_Notification)




export default router
