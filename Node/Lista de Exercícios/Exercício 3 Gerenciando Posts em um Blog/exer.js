const express = require('express');
const app = express();

app.use(express.json()); 

let posts = [
  { id: 1, titulo: 'Primeiro Post', conteudo: 'Conteúdo do primeiro post...', autor: 'Carlos' },
  { id: 2, titulo: 'Segundo Post', conteudo: 'Olá, mundo!', autor: 'Ana' }
];
 
app.post('/posts', (req, res) => {
  const { titulo, conteudo, autor } = req.body;
 
  if (!titulo || !conteudo || !autor) {
    return res.status(400).json({ erro: 'Campos "titulo", "conteudo" e "autor" são obrigatórios.' });
  }

  const novoPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    titulo,
    conteudo,
    autor
  };

  posts.push(novoPost);
  res.status(201).json(novoPost);
});

app.get('/posts/autor/:autor', (req, res) => {
  const autorParam = req.params.autor.toLowerCase();

  const filtrados = posts.filter(p => p.autor.toLowerCase() === autorParam);

  if (filtrados.length === 0) {
    return res.status(404).json({ mensagem: 'Nenhum post encontrado para este autor.' });
  }

  res.json(filtrados);
});

app.patch('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { conteudo } = req.body;

  const post = posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ erro: 'Post não encontrado.' });
  }

  if (!conteudo) {
    return res.status(400).json({ erro: 'Campo "conteudo" é obrigatório para atualização.' });
  }

  post.conteudo = conteudo;
  res.json(post);
});

app.listen(port, () => {
  console.log("Servidor rodando em http://localhost:" + port);
});