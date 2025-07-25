import { validationResult } from "express-validator"

export const validationsErrors = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({errors: errors.array()});
    next()
}