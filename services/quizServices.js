import db from '../database/models/index.js';

const validatePayload = (payload) => {
    if (payload.isPublished === null || payload.isPublished === undefined) {
        return {
            isPublished: 'Do we want to publish this quiz?',
        };
    }
    if (!payload.isPublished) {
        return null;
    }
    let errors = {};
    if (!payload.title) {
        errors = {
            ...errors,
            title: 'Title is missing',
        };
    }
    if (!payload.description) {
        errors = {
            ...errors,
            description: 'Description is missing',
        };
    }

    if (Object.keys(errors).length === 0) {
        return null;
    }
    return errors;
};


const createQuiz = async (payload, id = null) => {
    const validationResult = validatePayload(payload);

    console.log(validationResult);
    if (validationResult) {
        return {
            status: 400,
            responseData: validationResult,
        };
    }

    let result;
    await db.sequelize.transaction(async (t) => {
        const { Quiz } = db;
        result = await Quiz.create(
            {
                title: payload.title,
                description: payload.description,
            },
            { transaction: t },
        );
    });
    return {
        status: 200,
        responseData: result,
    };
};

const getQuiz = async (id) => {
    const { Quiz, Question } = db;
    const result = await Quiz.findByPk(id, {
        include: [
            {
                model: Question,
                as: 'questions',
                required: false,
            },
        ],
    });

    if (!result) {
        return {
            status: 404,
            responseData: 'No result found',
        };
    }
    return {
        status: 200,
        responseData: result,
    };
};

export { createQuiz, getQuiz };
