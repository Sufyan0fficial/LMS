import express from 'express'
import { Authorize_Role, Verify_User } from '../MiddleWare/auth.js'
import { Access_Course_Content, Add_Review, Answer_Question, Ask_Question, Delete_Course, Edit_Course, Get_All_Courses, Get_Courses, Get_Single_Course, Reply_Review, Upload_Course, VdoCipher_Video_Data, Get_Reviews, Edit_Review, Get_User_Review, Search_Courses, Get_All_Reviews } from '../Controller/course.controller.js'
const router = express.Router()

// Admin-only routes
router.route('/upload').post(Verify_User, Authorize_Role('admin'), Upload_Course)
router.route('/edit/:id').patch(Verify_User, Authorize_Role('admin'), Edit_Course)
router.route('/delete-course/:id').delete(Verify_User, Authorize_Role('admin'), Delete_Course)
router.route('/get-all-courses').get(Verify_User, Authorize_Role('admin'), Get_All_Courses)
router.route('/answer-question').patch(Verify_User, Authorize_Role('admin'), Answer_Question)
router.route('/reply-review').patch(Verify_User, Authorize_Role('admin'), Reply_Review)

// Public routes
router.route('/get-course/:id').get(Get_Single_Course)
router.route('/get-courses').get(Get_Courses)
router.route('/search').get(Search_Courses)
router.route('/get-all-reviews').get(Get_All_Reviews)
router.route('/get-demoVideo').post(VdoCipher_Video_Data)

// Authenticated user routes
router.route('/get-course-content/:id').get(Verify_User, Access_Course_Content)
router.route('/ask-question').patch(Verify_User, Ask_Question)
router.route('/add-review/:id').patch(Verify_User, Add_Review)
router.route('/get-reviews/:id').get(Verify_User, Get_Reviews)
router.route('/edit-review/:id').patch(Verify_User, Edit_Review)
router.route('/get-user-review/:id').get(Verify_User, Get_User_Review)

export default router