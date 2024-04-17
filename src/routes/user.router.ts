import userController from "../controller/user.controller";
import {body, validationResult} from 'express-validator'
import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth-middleware";
import {CatchValidationErrors} from './ErrorsCatcher'
const router = Router()

const RegistrationInput = [
    body('login').isLength({min: 0, max: 200}),
    body('email').isEmail(),
    body('password').isStrongPassword({minLength: 7, minLowercase: 2, minSymbols: 1}),
]

router.get('/logout', userController.logout)
router.post('/auth', RegistrationInput, CatchValidationErrors, userController.registration)
router.post('/login', RegistrationInput, CatchValidationErrors, userController.login)
router.get('/activate/:link', userController.activate)
router.get('/:login', userController.getUser)
router.delete('/:login', userController.deleteUser)
router.get('/', authMiddleware, userController.getAllUsers)

export = router