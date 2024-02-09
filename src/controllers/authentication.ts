import express from 'express'
import { createUser, getUserByEmail } from '../db/users'
import { random, authentication } from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
  try {

    const { email, password } = req.body

    if (!email || !password) {
      throw new Error()
    }

    const user = await getUserByEmail(email).select('+authentication.salt + authentication.password')

    if (!user || !user?.authentication?.salt) {
      throw new Error()
    }

    const expectedHash = authentication(user.authentication.salt, password)

    if (expectedHash !== user.authentication.password) {
      return res.sendStatus(403)
    }

    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie('demo-auth', user.authentication.sessionToken, { domain: 'localhost', path:'/' })

    return res.json(user)

  } catch (error) {
    console.log(error);
    return res.sendStatus(400)
  }
}



export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      throw new Error()
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res
        .json({
          message: 'User already exist',
        })
        .status(400)
    }

    const salt = random()
    const user = await createUser({
      username,
      email,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    })

    return res.json(user).status(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
