import { ValidationError } from "yup";

export const parseValidationError = (err: ValidationError[]) => {
    const parsed: Array<{ path: string, message: string}> = [];
    err.forEach(e => {
        parsed.push({
            path: e.path,
            message: e.message,
        });
    });

    return parsed;
}