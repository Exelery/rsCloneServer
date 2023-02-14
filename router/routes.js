import passport from 'passport'
import UserController from '../controller/userController.js'
import DataController from '../controller/dataController.js'
import { body } from 'express-validator'
import { Router } from 'express'
import pass from '../middleware/authorisation.js'

export const router = new Router()
const userController = new UserController()
const dataController = new DataController()

router.get('/users', pass, userController.getAllUsers)
// .get(passport.authenticate('jwt', { session: false }), getAllUsers)
router.post('/auth/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration)
router.post('/auth/login', userController.login)
router.post('/auth/logout', userController.logout)
router.post('/auth/refresh', userController.refresh)
router.get('/auth/activate/:link', userController.activate)

router.post('/data/update', dataController.updateProject)
router.post('/data/add', dataController.addProject)
router.post('/data/get', dataController.getUserData)
router.post('/data/delete', dataController.deleteProject)
