const express = require('express');
const pacientesRoutes = require('./routes/pacientes');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// GET / (PÚBLICA)
app.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à API da Clínica Médica!' });
});

app.use('/', authRoutes);              // POST /login
app.use('/pacientes', pacientesRoutes); // CRUD de pacientes

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));