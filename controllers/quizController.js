import express from 'express';
const router = express.Router();
import createResponse from '../services/createResponse.js';

router.post('/', async (req, res) => {
    createResponse(res,{responseData: 123});
});

export default router;