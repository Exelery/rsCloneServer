import UserController from '../controller/userController.js'
import DataController from '../controller/dataController.js'
import { body } from 'express-validator'
import { Router } from 'express'
import pass from '../middleware/authorisation.js'

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), "..");
console.log('router', __dirname)


export const router = new Router()
const userController = new UserController()
const dataController = new DataController()

router.get('/users', pass, userController.getAllUsers)
router.get('/user', pass, userController.getUser)
router.put('/user', pass, body('email').isEmail(),
  userController.updateUser)
router.post('/user/resetpass', userController.reset)
router.get('/user/activate', userController.activateUserAgain)

router.post('/auth/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration)
router.post('/auth/login', body('email').isEmail(),
  body('password').isLength({ max: 32 }), userController.login,)
router.get('/auth/logout', pass, userController.logout)
router.post('/auth/refresh', userController.refresh)
router.get('/auth/activate/:link', userController.activate)


router.put('/data', pass, dataController.updateProject)
router.post('/data', pass, dataController.addProject)
router.get('/data', pass, dataController.getUserProjects)
router.delete('/data', pass, dataController.deleteProject)
router.post('/data/bind', pass, dataController.bindProject)

router.get('/page/:hash/:file', dataController.findBindingProjectByUrl);
