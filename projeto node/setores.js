const express = require('express');
const router = express.Router();
const path = require('path');

let setores = [];

function autenticarGerente(req, res, next) {
  const { role } = req.user || {};
  if (role === 'GERENTE') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado. Apenas Gerentes podem cadastrar setores' });
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'visual', 'setores', 'cadastroSetores.html'));
});

router.post('/add', autenticarGerente, (req, res) => {
  const { nome, responsavel } = req.body;

  if (!nome || !responsavel) {
    return res.status(400).json({ message: "Nome do setor e responsável são obrigatórios." });
  }

  const novoSetor = {
    id: setores.length + 1,
    nome,
    responsavel
  };

  setores.push(novoSetor);

  return res.status(201).json({
    message: 'Setor adicionado com sucesso!',
    setor: novoSetor
  });
});

router.delete('/remove/:id', autenticarGerente, (req, res) => {
  const { id } = req.params;
  const index = setores.findIndex(s => s.id == id);

  if (index === -1) {
    return res.status(404).json({ message: 'Setor não encontrado.' });
  }

  const setorRemovido = setores.splice(index, 1);

  return res.json({
    message: 'Setor removido com sucesso!',
    setor: setorRemovido
  });
});

module.exports = router;
