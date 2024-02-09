import express from 'express'
import { isAuthenticated, isOwner } from '../middleware'
import { getAllUsers, deleteUser } from '../controllers/users'

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers)
    router.delete('/users/:id', isOwner, deleteUser)
}