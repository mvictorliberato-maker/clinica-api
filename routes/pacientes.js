const express = require('express');
const { Paciente } = require('../models');
const { verificaJWT } = require('../middlewares/verificaJWT');

const router = express.Router();

// Não devolve a senha nas respostas
const semSenha = { attributes: { exclude: ['senha'] } };

// POST /pacientes -> cadastro (PÚBLICA)
router.post('/', async (req, res) => {
  try {
    const { nome, idade, sexo, usuario, senha } = req.body;
    if (!nome || idade === undefined || !sexo || !usuario || !senha) {
      return res.status(400).json({ mensagem: 'Preencha nome, idade, sexo, usuario e senha.' });
    }

    const existe = await Paciente.findOne({ where: { usuario } });
    if (existe) {
      return res.status(409).json({ mensagem: 'Usuário já cadastrado.' });
    }

    const novo = await Paciente.create({ nome, idade, sexo, usuario, senha });
    const { senha: _, ...dados } = novo.toJSON();
    return res.status(201).json(dados);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao cadastrar paciente.', erro: erro.message });
  }
});

// GET /pacientes -> lista todos (PRIVADA)
router.get('/', verificaJWT, async (req, res) => {
  try {
    const pacientes = await Paciente.findAll(semSenha);
    return res.json(pacientes);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar pacientes.', erro: erro.message });
  }
});

// GET /pacientes/:id -> busca por id (PRIVADA)
router.get('/:id', verificaJWT, async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id, semSenha);
    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }
    return res.json(paciente);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar paciente.', erro: erro.message });
  }
});

// PUT /pacientes/:id -> atualiza (PRIVADA)
router.put('/:id', verificaJWT, async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }

    const campos = ['nome', 'idade', 'sexo', 'usuario', 'senha'].filter((c) => req.body[c] !== undefined);
    await paciente.update(req.body, { fields: campos });

    const { senha: _, ...dados } = paciente.toJSON();
    return res.json(dados);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao atualizar paciente.', erro: erro.message });
  }
});

// DELETE /pacientes/:id -> remove (PRIVADA)
router.delete('/:id', verificaJWT, async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
    }
    await paciente.destroy();
    return res.json({ mensagem: 'Paciente removido com sucesso.' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao remover paciente.', erro: erro.message });
  }
});

module.exports = router;