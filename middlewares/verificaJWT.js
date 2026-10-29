const jwt = require('jsonwebtoken');

const SECRET = 'segredo_clinica';

function verificaJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ auth: false, mensagem: 'Token não fornecido.' });
  }

  // Aceita "Bearer <token>" ou só "<token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: false, mensagem: 'Token inválido ou expirado.' });
    }
    req.pacienteId = decoded.id;
    next();
  });
}

module.exports = { verificaJWT, SECRET };