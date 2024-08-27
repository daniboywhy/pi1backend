import express from 'express';
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'

const app = express();
app.use(express.json())

app.use('/', publicRoutes);
app.use('/', auth, privateRoutes);






app.listen(3000, () => console.log("Server UP^^"));

//daniboywhy
//UXhivTxhTcCu1xlU
//mongodb+srv://daniboywhy:UXhivTxhTcCu1xlU@dbp1.puvmz.mongodb.net/dbp1?retryWrites=true&w=majority&appName=dbp1
