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

    let validQuestions = true;
    let validOptions = true;
    let inValidCorrectOptions = true;

    payload.questions.forEach(question=>{
        if(!question.description){
            validQuestions = false;
        }

        let numberOfCorrectOptions = 0;
        question.options.forEach((option)=>{
            if(!option.value){
                validOptions = false;
            }
            numberOfCorrectOptions += option.isCorrect ? 1 : 0;
        })

        inValidCorrectOptions = inValidCorrectOptions && (numberOfCorrectOptions === 1);
    });

    if (!validQuestions) {
        errors = {
            ...errors,
            question: 'Some questions are missing descriptions.',
        }
    }

    if(!inValidCorrectOptions){
        errors = {
            ...errors,
            question: 'Some questions have invalid number(>1 or 0) of correct options.',
        }
    }
    if (!validOptions) {
        errors = {
            ...errors,
            option: 'Some options are missing  values.',
        }
    }
    if (Object.keys(errors).length === 0) {
        return null;
    }
    return errors;
};


const publishQuiz = async (id) => {
    const { Quiz } = db;
    const result = await Quiz.findByPk(id);

    if (!result) {
        return {
            status: 404,
            responseData: 'No result found',
        };
    }
    result.isPublished = true;
    await result.save();
    return {
        status: 200,
        responseData: result,
    };;
};

const createQuiz = async (payload) => {
    const validationResult = validatePayload(payload);

    if (validationResult) {
        return {
            status: 400,
            responseData: validationResult,
        };
    }

    let result;
    await db.sequelize.transaction(async (t) => {
        const { Quiz, Question, Option } = db;
        result = await Quiz.create(
            {
                title: payload.title,
                description: payload.description,
            },
            { transaction: t },
        );
        await Promise.all(
            payload.questions.map(async questionPayload=>{
                const question = await Question.create(
                    {
                        description: questionPayload.description,
                        isMandatory: !!questionPayload.isMandatory,
                        quizId: result.id,
                    },
                    { transaction: t },
                );
                await Promise.all(
                    questionPayload.options.map(async option=>{
                        await Option.create(
                            {
                                value: option.value,
                                isCorrect: !!option.isCorrect,
                                questionId: question.id,
                            },
                            { transaction: t },
                        );
                    })
                )
            })
        )
    });
    return {
        status: 200,
        responseData: await getQuiz(result.id),
    };
};

const getQuiz = async (id) => {
    const { Quiz, Question, Option } = db;
    const result = await Quiz.findByPk(id, {
        include: [
            {
                model: Question,
                as: 'questions',
                required: false,
                include: {
                    model: Option,
                    as: 'options'
                }
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

export { createQuiz, getQuiz, publishQuiz };
