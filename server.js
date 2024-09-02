import express from 'express';
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json())

app.use('/', publicRoutes);
app.use('/', auth, privateRoutes);






app.listen(3000, () => console.log("Server UP^^"));

//daniboywhy
//UXhivTxhTcCu1xlU
//mongodb+srv://daniboywhy:UXhivTxhTcCu1xlU@dbp1.puvmz.mongodb.net/dbp1?retryWrites=true&w=majority&appName=dbp1
//cbdc5498805a585ad6e8fed76f3ec52526bcca669b21ae29c14faf07b2405971