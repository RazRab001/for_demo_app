import express, {Application, Request, Response} from "express";
import cookieParser from "cookie-parser"
import coockieSession from "cookie-session"
import UserRouter from "./routes/user.router"
import "./config/passport"
import cors from 'cors';
import mongoose from "mongoose"
import dotenv from "dotenv"
import passport from "passport";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3300

app.set("view engine", "ejs");
app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
app.use(coockieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SESSION_SECRET as string]
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL as string).then(() => {
    console.log('Mongo: succes connection to db')
})
const db = mongoose.connection
db.on('error', (err: Error)=> console.log(`Mongo ERROR: ${err}`))

app.get('/', (req: Request, res: Response) => {
    res.json({message: "Hello, world!!"})
})

app.use('/user', UserRouter)

if(require.main === module){
    db.once('open', () => {
        app.listen(port, ()=> console.log(`Server start on http://localhost:${port}`))
    })
}

export = app
