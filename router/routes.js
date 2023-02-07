import passport from 'passport'
import UserController from '../controller/userController.js'
import {Router} from 'express'

export const router = new Router()
const userController = new UserController()

router.get('/users', userController.getAllUsers)
  // .get(passport.authenticate('jwt', { session: false }), getAllUsers)
  router.post('/auth/signup', userController.signup)
  router.post('/auth/signin', userController.signin)
  router.get('/auth/logout')
  router.get('/auth/activate')

// export const routes = (app) => {
//   app.route('/api/users')
//   .get(passport.authenticate('jwt', { session: false }), getAllUsers)
//   app.route('/api/auth/signup').post(signup)
//   app.route('/api/auth/signin').post(signin)
//   app.route('/api/auth/logout')
//   app.route('/api/auth/activate')
//   // app.route('/api/posts')
//   // .get(passport.authenticate('jwt', { session: false }), postsController.getPosts)
// }
