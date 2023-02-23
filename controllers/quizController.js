import express from 'express';
import createResponse from '../services/createResponse.js';
import { createQuiz, getQuiz, publishQuiz } from '../services/quizServices.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const response = await createQuiz(req.body);
    return createResponse(res,response);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const response = await getQuiz(id);
    return createResponse(res,response);
});

router.post('/:id/publish', async (req, res) => {
    const { id } = req.params;
    const response = await publishQuiz(id);
    return createResponse(res,response);
});

export default router;