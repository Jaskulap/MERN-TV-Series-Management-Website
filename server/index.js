require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const tokenVerification = require('./middleware/tokenVerification')

//middleware
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
const connection = require('./db')
connection()

const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const serialRoutes = require("./routes/serials")
const commentRoutes= require("./routes/comments")
//trasy wymagające weryfikacji tokenem:
app.get("/api/users/",tokenVerification)
app.get("/api/users/detail",tokenVerification)
app.get("/api/users/addedSerials",tokenVerification)
app.get("/api/serials/",tokenVerification)
app.get("/api/serials/:title",tokenVerification)
app.post("/api/users/addSerial/",tokenVerification)
app.get("/api/users/checkSerial/",tokenVerification)
app.post('/api/users/addEpisode/',tokenVerification)
app.delete('/api/users/removeEpisode/',tokenVerification)
app.get('api/comments/',tokenVerification)
app.post('api/comments/',tokenVerification);;
//POTEM trasy nie wymagające tokena (kolejność jest istotna!)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) //tylko metoda get wymaga tokena
app.use("/api/serials",serialRoutes)
app.use("/api/comments",commentRoutes)