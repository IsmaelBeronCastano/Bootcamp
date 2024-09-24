import Joi, {ObjectSchema} from 'joi'


const userSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().messages({
    'string.base':'Name must be of type string',
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  _id:Joi.string().optional(),
  email: Joi.string().required().messages({
    'string.base':'Email must be of type string',
    'string.empty': 'email is required',
    'any.required': 'email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'password is required',
    'any.required': 'password is required'
  })  
})

export {userSchema}