import { z } from '@hono/zod-openapi'

export function stringField(min?: number, max?: number, requiredMessage: string = 'Поле обязательно к заполнению', minMessage: string = `Минимальная длина ${min}`, maxMessage: string = `Максимальная длина ${max}`) {
  let schema = z.string({ required_error: requiredMessage })

  if (min !== undefined) {
    schema = schema.min(min, minMessage.replace(`${min}`, min.toString()))
  }

  if (max !== undefined) {
    schema = schema.max(max, maxMessage.replace(`${max}`, max.toString()))
  }

  return schema
}

export function emailField(requiredMessage: string = 'Поле обязательно к заполнению', emailMessage: string = 'Некорректный формат почты') {
  return z.string({ required_error: requiredMessage }).email({
    message: emailMessage,
  })
}

export function phoneField(requiredMessage: string = 'Поле обязательно к заполнению', phoneMessage: string = 'Некорректный формат номера телефона') {
  return z
    .string({ required_error: requiredMessage })
    .regex(/^(?:\+7|8)\d{10}$/, phoneMessage)
}

export function enumField(values: [string, ...string[]], requiredMessage: string = 'Поле обязательно к заполнению') {
  return z.enum(values, {
    errorMap: (issue) => {
      const { code } = issue
      if (code === 'invalid_type') {
        return { message: requiredMessage }
      }
      if (code === 'invalid_enum_value') {
        return {
          message: `Неверное значение поля. Ожидалось ${issue.options.map(
            item => item,
          )}, полученное значение: ${issue.received}`,
        }
      }
      return { message: '' }
    },
  }).openapi({ examples: values })
}

export const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: 'id',
      in: 'path',
      required: true,
    },
    required: ['id'],
    example: 42,
  }),
})

export const SlugParamsSchema = z.object({
  slug: z.string().min(1).openapi({
    param: {
      name: 'slug',
      in: 'path',
      required: true,
    },
    required: ['slug'],
  }),
})
