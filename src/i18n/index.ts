import { successMessage } from "./success";
import { errorMessage } from "./error";

export const statusMessage = (locale: string, code: any, status: boolean) => {
    let messages: any[] = [];
    if (status) {
        messages = successMessage(code);
    } else {
        messages = errorMessage(code);
    }

    messages.filter((o: any) => o.country === locale);
    return messages[0].message;
}