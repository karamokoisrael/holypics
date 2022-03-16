import * as Joi from 'joi-browser';

const schemas = {
    signUp: Joi.object().keys(
        {
        names:  Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        accountType: Joi.string().required(),
        phone: Joi.number().required(),
        province: Joi.string().required()
      }),

    signIn: Joi.object().keys(
        {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      }),

    passForgotten: Joi.object().keys({
      email: Joi.string().email().required()
    })
};

export default schemas;