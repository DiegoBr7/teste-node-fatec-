const setoresRouter = require('./setores');


// server.js (CommonJS)
const express = require('express');
const path = require('path');
//const { randomUUID } = require('node:crypto');

let nextId = 1 ;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'visual')));


const users = []; // { id, nome, email, senha }

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'visual', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'visual', 'home.html'));
});

// Login (exemplo simples com checagem)
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const user = users.find(u => u.email === email && u.senha === senha);
  if (!user) return res.status(401).json({ erro: 'Credenciais inválidas' });

  return res.redirect(303, '/home');
});

// CREATE
app.post('/api/users', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' });
  }

  const jaExiste = users.some(u => u.email === email);
  if (jaExiste) return res.status(409).json({ erro: 'E-mail já cadastrado' });

  const novo = { id: nextId++, nome, email, senha };
  users.push(novo);
  res.status(201).json({ mensagem: 'Usuario criado', usuario: { id: novo.id, nome, email } });
});

// READ
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ erro: 'Usuario nao encontrado' });
  res.json({ id: user.id, nome: user.nome, email: user.email });
});

app.get('/api/users/', (req, res) => {
  const lista = users.map(({id , nome , email})  => ({id , nome , email}))
  res.json(lista);
});

// UPDATE (PUT)
app.put('/api/users/:id', (req, res) => {
  const { nome, email, senha } = req.body;
  const idx = users.findIndex(u => String(u.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

  if (email) {
    const emailEmUso = users.some(u => u.email === email && String(u.id) !== String(req.params.id));
    if (emailEmUso) return res.status(409).json({ erro: 'E-mail já está em uso por outro usuário' });
  }
  if (nome !== undefined && String(nome).trim().length === 0) {
    return res.status(400).json({ erro: 'nome nao pode ser vazio' });
  }
  if (senha !== undefined && String(senha).length < 8) {
    return res.status(400).json({ erro: 'senha deve ter pelo menos 8 caracteres' });
  }

  // Atualiza somente o que vier
  if (nome !== undefined)  users[idx].nome  = nome;
  if (email !== undefined) users[idx].email = email;
  if (senha !== undefined) users[idx].senha = senha;

  const { id, nome: n, email: e } = users[idx];
  res.json({ mensagem: 'Usuario atualizado', usuario: { id, nome: n, email: e } });
});

// DELETE
app.delete('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => String(u.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

  users.splice(idx, 1);
  res.status(204).send();
});

// Start
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


//________________________________________________________________________________

// Middleware fake para simular autenticação (trocar depois por JWT)
app.use((req, res, next) => {
  // Exemplo: sempre logado como GERENTE
  req.user = { id: 1, nome: 'Diego', role: 'GERENTE' };
  next();
});

// Rotas de setores
app.use('/api/setores', setoresRouter);

//________________________________________________________________________________
