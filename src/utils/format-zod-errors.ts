import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
    return error.errors.map((err) => {
        const fieldPath = err.path.length > 0 ? err.path.join(".") : "unknown field";

        let message: string;
        switch (err.code) {
            case "invalid_type":
                message = `Поле "${fieldPath}" имеет неверный тип данных. Ожидается ${err.expected}, получено ${err.received}.`;
                break;
            case "too_small":
                message = `Поле "${fieldPath}" слишком короткое. Минимальная длина: ${err.minimum}.`;
                break;
            case "too_big":
                message = `Поле "${fieldPath}" слишком длинное. Максимальная длина: ${err.maximum}.`;
                break;
            case "invalid_string":
                if ('validation' in err) {
                    switch (err.validation) {
                        case "email":
                            message = `Поле "${fieldPath}" должен быть действительным email-адресом.`;
                            break;
                        case "uuid":
                            message = `Поле "${fieldPath}" должен быть корректным UUID.`;
                            break;
                        default:
                            message = `Поле "${fieldPath}" не соответствует требуемому формату.`;
                    }
                } else {
                    message = `Поле "${fieldPath}" содержит недопустимое значение.`;
                }
                break;
            case "invalid_enum_value":
                message = `Поле "${fieldPath}" должен быть одним из: ${err.options.join(", ")}.`;
                break;
            default:
                message = `Поле "${fieldPath}:" ${err.message}`;
        }

        return {
            field: fieldPath,
            message,
        };
    });
}