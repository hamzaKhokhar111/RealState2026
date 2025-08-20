import express from 'express'
// import { createListing } from '../Countroller/listing.controller.js';
import { verifyToken } from '../utilis/verifyUser.js';
import { createListing } from '../Countroller/listing.controller.js';

const router= express.Router();

router.post('/create',verifyToken, createListing)

export default router;