import express, { Router } from 'express'
import { google, signin, signOut, SignUp } from '../Countroller/auth.controller.js';

const router=express.Router();

router.post('/signup',SignUp)
router.post('/signin', signin)
router.post('/google',google)
router.get('/signout',signOut)
export default router;