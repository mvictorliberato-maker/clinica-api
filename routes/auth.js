const express = require('express');
const jwt = require('jsonwebtoken');
const { Paciente } = require('../models');
const { SECRET } = require('../middlewares/verificaJWT');

const router = express.Router();

// POST /login (PÚBLICA)
router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
      return res.status(400).json({ mensagem: 'Informe usuario e senha.' });
    }

    const paciente = await Paciente.findOne({ where: { usuario } });

    // Comparação simples de strings, como pede a atividade
    if (!paciente || paciente.senha !== senha) {
      return res.status(401).json({ auth: false, mensagem: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ id: paciente.id }, SECRET, { expiresIn: '1h' });
    return res.json({ auth: true, token });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro no login.', erro: erro.message });
  }
});

module.exports = router;