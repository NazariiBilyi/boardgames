import {getItemValidationRules} from "./getItemValidationRules";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const validate = (getRules: typeof getItemValidationRules, isEdit: boolean = false) => [
    (req: Request, res: Response, next: NextFunction) => {
        const rules = getRules(req, res, next, isEdit);
        Promise.all(rules.map(validation => validation.run(req)))
            .then(() => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                next();
            });
    }
];