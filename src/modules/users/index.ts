import {Hono} from "hono";

export const users = new Hono()

users.get('/', (c) => c.json('users list'))
users.get('/:id', (c) => c.json(`user #${c.req.param('id')}`))
users.post('/', (c) => c.json('create user', 201))
users.put('/:id', (c) => c.json(`put user #${c.req.param('id')}`))
users.patch('/:id', (c) => c.json(`patch user #${c.req.param('id')}`))
users.delete('/:id', (c) => c.json(`delete user #${c.req.param('id')}`))

