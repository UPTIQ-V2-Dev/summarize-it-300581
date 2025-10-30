import Joi from 'joi';

const summarize = {
    body: Joi.object().keys({
        text: Joi.string().required().min(10),
        options: Joi.object().keys({
            length: Joi.string().valid('short', 'medium', 'long'),
            style: Joi.string().valid('paragraph', 'bullet', 'outline'),
            extractKeywords: Joi.boolean()
        })
    })
};

const getHistory = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    })
};

const saveHistory = {
    body: Joi.object().keys({
        originalText: Joi.string().required(),
        summary: Joi.string().required(),
        options: Joi.object().required(),
        title: Joi.string().required(),
        wordCount: Joi.number().integer().required().min(1)
    })
};

const deleteHistory = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
};

export default {
    summarize,
    getHistory,
    saveHistory,
    deleteHistory
};
