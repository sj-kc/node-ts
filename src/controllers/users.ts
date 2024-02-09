import express from 'express'

import { getUsers, deleteUserById } from '../db/users'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()

        return res.json(users)
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new Error()
        }

        const user = await deleteUserById(id)

        return res.json(user)
    } catch (error) {
        return res.sendStatus(400)
        console.log(error);
    }
}