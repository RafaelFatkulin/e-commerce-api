import {Hono} from "hono";
import {createUser, deleteUser, getUserByEmail, getUserById, getUsers, updateUser} from "./users.service";
import {zValidator} from "@hono/zod-validator";
import {insertUserSchema, updateUserSchema} from "@modules/users/users.schema";

export const users = new Hono()

users.get('/', async (c) => {
    return c.json({
        data: await getUsers()
    })
})
users.get('/:id', async (c) => {
    const {id} = c.req.param()

    return c.json({
        data: await getUserById(parseInt(id))
    })
})
users.post(
    '/',
    zValidator('json', insertUserSchema),
    async (c) => {
        const userData = c.req.valid('json')
        const existingUser = await getUserByEmail(userData.email)

        if(existingUser.length) {
            return c.json({
                message: 'Пользователь с такой почтой уже существует'
            }, 500)
        }

        const user = await createUser(userData)

        return c.json({
            user
        })
    })
users.put(
    '/:id',
    zValidator('json', updateUserSchema),
    async (c) => {
        const {id} = c.req.param()
        const userData = c.req.valid('json')
        const existingUser = await getUserById(parseInt(id))

        if(!existingUser) {
            return c.json({
                message: 'Такой пользователь не найден'
            }, 500)
        }

        const updatedUser = await updateUser(
            parseInt(id),
            userData
        )

        return c.json({
            data: updatedUser
        })
    })

users.delete('/:id', async (c) => {
    const {id} = c.req.param()
    const existingUser = await getUserById(parseInt(id))

    if(!existingUser) {
        return c.json({
            message: 'Такой пользователь не найден'
        }, 500)
    }

    const deletedUser = await deleteUser(parseInt(id))

    return c.json({
        message: deletedUser.length ? `Пользователь с e-mail "${deletedUser[0].email}" удален` : 'Пользователь удален'
    })
})

