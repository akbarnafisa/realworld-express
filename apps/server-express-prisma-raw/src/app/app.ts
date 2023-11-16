import express from 'express'
import cors from 'cors'
import publicRoutes from '../routes/public'

const app = express()

app.use(express.json())
app.use(cors())

app.use(publicRoutes)


export default app