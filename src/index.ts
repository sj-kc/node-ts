import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose  from 'mongoose'
import router from './router'

const app = express()

const MONGO_URL =  process.env.MONGO_URL as string
const PORT = process.env?.PORT || 8080

app.use(cors({
    credentials: true
}))

app.use(compression())
app.use(cookieParser())
app.use(express.json())

app.listen(PORT, () => console.log('server up'))

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (err: Error) => console.log(err))

app.use('/', router())
