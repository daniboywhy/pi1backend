import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({message: 'Non-authorized Acess'})
    }

    jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'token inválido'});
        req.user = user;

    })


    next()
}

export default auth;