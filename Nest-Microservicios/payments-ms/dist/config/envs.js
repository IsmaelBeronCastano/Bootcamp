"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const joi = require("joi");
const envsSchema = joi.object({
    PORT: joi.number().required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_UR: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
})
    .unknown(true);
const { error, value } = envsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const envVars = value;
exports.envs = {
    port: envVars.PORT,
    stripeSecret: envVars.STRIPE_SECRET,
    stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
    stripeCancelUrl: envVars.STRIPE_CANCEL_UR,
    stripeEndpointSecret: envVars.STRIPE_ENDPOINT_SECRET,
};
//# sourceMappingURL=envs.js.map