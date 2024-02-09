import express from 'express'
import { getUserBySessionToken } from '../db/users'
import { merge, get } from 'lodash'

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params
        const currentUserId = get(req, 'identity._id') as unknown as string
        
        if (!currentUserId) {
            return res.sendStatus(403)
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403)
        }
        
        next()
    } catch (error) {
        console.log(error);
        return res.send(403)
    }
}


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['demo-auth']

        if (!sessionToken) {
            return res.sendStatus(403)
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!sessionToken) {
            return res.sendStatus(403)
        }

        merge(req, { identity: existingUser })

        return next()
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}