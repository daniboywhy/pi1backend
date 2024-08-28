import express from "express"; 
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


//cadastros
router.post('/cadastro', async (req, res) => {
    try {
      const { email, cpf, name, usuario, password, tipoUsuario } = req.body;
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      let userDB;
  
      if (tipoUsuario === 'aluno') {
        userDB = await prisma.aluno.create({
          data: {
            email,
            cpf,
            name,
            usuario,
            password: hashPassword,
          },
        });
      } else if (tipoUsuario === 'tutor') {
        userDB = await prisma.tutor.create({
          data: {
            email,
            cpf,
            name,
            usuario,
            password: hashPassword,
          },
        });
      } else {
        return res.status(400).json({ message: "Tipo de usuário inválido" });
      }
  
      res.status(201).json(userDB);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro no servidor" });
    }
  });
  

//logins

router.post('/login', async (req, res) => {
    try{
    const { email, password, tipoUsuario } = req.body;

    let user;

    if (tipoUsuario === 'aluno') {
      user = await prisma.aluno.findUnique({
        where: { email },
      });

    } else if (tipoUsuario === 'tutor') {
      user = await prisma.tutor.findUnique({
        where: { email },
      });
    } else {
        return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    if(!user){
        return res.status(404).json({message: "Invalid Credentials"})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        return res.status(400).json({message: "Invalid Password"})
    }

    const token = jwt.sign({ id: user.id}, JWT_SECRET, { expiresIn: '1d'})

    res.status(200).json(token)

    } catch(err) {
        res.status(500).json({message:"Server Error"})
    }
})

router.post('/tutor', async (req, res) => {
    await prisma.tutor.create({
        data: { 
            usuario: req.body.usuario,
            senha: req.body.senha,
            email: req.body.email,
            nome: req.body.nome,
            cpf: req.body.cpf
        }
    });

    res.status(201).json(req.body);
});

router.get('/tutor', async (req, res) => {
    const tutor = await prisma.tutor.findMany();
    res.status(200).json(tutor);
});

router.put('/tutor/:id', async (req, res) => {
    await prisma.tutor.update({
        where: {
            id: req.params.id
        },
        data: {
            nome: req.body.nome,
            cpf: req.body.cpf
        }  
    });
    res.status(200).json(req.body);
});

router.delete('/tutor/:id', async (req, res) => {
    await prisma.tutor.delete({
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({ message: 'Usuário deletado' });
});

/*
API DO TUTOR FEITA

*/


router.post('/aluno', async (req, res) => {
    await prisma.aluno.create({
        data: { 
            usuario: req.body.usuario,
            senha: req.body.senha,
            email: req.body.email,
            nome: req.body.nome,
            cpf: req.body.cpf
        }
    });

    res.status(201).json(req.body);
});

router.get('/aluno', async (req, res) => {
    const aluno = await prisma.aluno.findMany();
    res.status(200).json(aluno);
});

router.put('/aluno/:id', async (req, res) => {
    await prisma.aluno.update({
        where: {
            id: req.params.id
        },
        data: {
            nome: req.body.nome,
            cpf: req.body.cpf
        }  
    });
    res.status(200).json(req.body);
});

router.delete('/aluno/:id', async (req, res) => {
    await prisma.aluno.delete({
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({ message: 'Usuário deletado' });
});

export default router;