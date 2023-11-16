import express from 'express'


const routes = express.Router()

routes.get("/", (_, res) => {
  res.status(200).send('test 123')
})


export default routes