const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'visual/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
app.post('/api/auth/login', (req, res) => {
   const { email , senha } = req.body;

   if(!email || !senha){
    return res.status(400).json({erro: 'Email e senha sao obrigatorios'})
   }

   res.status(200).json({mensagem : 'Login recebido com sucesso' , email});
});