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
            cpf: req.body.cpf,
            disciplinas: req.body.disciplinas
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
            cpf: req.body.cpf,
            disciplinas: req.body.disciplinas
        }  
    });
    res.status(200).json(req.body);
});

router.delete('/tutor/:id', async (req, res) => {
    await prisma.tutor.delete({
        where: {
            id: req.params.id,
            disciplinas: req.params.disciplinas
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
            tutores: req.body.tutores,
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
            cpf: req.body.cpf,
            tutores: req.body.tutores
        }  
    });
    res.status(200).json(req.body);
});

router.delete('/aluno/:id', async (req, res) => {
    await prisma.aluno.delete({
        where: {
            id: req.params.id,
            tutores: req.params.tutores
        }
    });

    res.status(200).json({ message: 'Usuário deletado' });
});

// Criar uma nova disciplina
router.post('/disciplina', async (req, res) => {
  try {
      const { nome, descricao } = req.body;

      const disciplina = await prisma.disciplina.create({
          data: {
              nome,
              descricao,
          },
      });

      res.status(201).json(disciplina);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Listar todas as disciplinas
router.get('/disciplina', async (req, res) => {
  try {
      const disciplinas = await prisma.disciplina.findMany();
      res.status(200).json(disciplinas);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar uma disciplina
router.put('/disciplina/:id', async (req, res) => {
  try {
      const { nome, descricao } = req.body;

      const disciplina = await prisma.disciplina.update({
          where: { id: req.params.id },
          data: {
              nome,
              descricao,
          },
      });

      res.status(200).json(disciplina);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Deletar uma disciplina
router.delete('/disciplina/:id', async (req, res) => {
  try {
      await prisma.disciplina.delete({
          where: { id: req.params.id },
      });

      res.status(200).json({ message: 'Disciplina deletada com sucesso' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});
// Criar uma nova turma (vincula tutor, aluno e disciplina)
router.post('/turma', async (req, res) => {
  try {
      const { tutorId, alunoId, disciplinaId, ano, semestre } = req.body;

      const turma = await prisma.turma.create({
          data: {
              tutorId,
              alunoId,
              disciplinaId,
              ano,
              semestre,
          },
      });

      res.status(201).json(turma);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Listar todas as turmas
router.get('/turma', async (req, res) => {
  try {
      const turmas = await prisma.turma.findMany({
          include: {
              tutor: true,
              aluno: true,
              disciplina: true,
          },
      });
      res.status(200).json(turmas);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Atualizar uma turma
router.put('/turma/:id', async (req, res) => {
  try {
      const { tutorId, alunoId, disciplinaId, ano, semestre } = req.body;

      const turma = await prisma.turma.update({
          where: { id: req.params.id },
          data: {
              tutorId,
              alunoId,
              disciplinaId,
              ano,
              semestre,
          },
      });

      res.status(200).json(turma);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Deletar uma turma
router.delete('/turma/:id', async (req, res) => {
  try {
      await prisma.turma.delete({
          where: { id: req.params.id },
      });

      res.status(200).json({ message: 'Turma deletada com sucesso' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
  }
});




export default router;