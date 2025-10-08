const express = require('express');
const app = express();
const port = 3000;

 app.use(express.json());
 
 let comentarios = [
  { id: 1, post_id: 1, texto: 'Ótimo post!' },
  { id: 2, post_id: 2, texto: 'Concordo, muito bom.' }
];

app.get('/posts/:id/comentarios', (req, res) => {
  const postId = parseInt(req.params.id);

  const comentariosDoPost = comentarios.filter(c => c.post_id === postId);

  res.json(comentariosDoPost);
});

app.post('/posts/:id/comentarios', (req, res) => {
  const postId = parseInt(req.params.id);
  const { texto } = req.body;

  if (!texto || texto.trim() === '') {
    return res.status(400).send('O texto do comentário é obrigatório.');
  }

  const novoId = comentarios.length > 0 ? comentarios[comentarios.length - 1].id + 1 : 1;

  const novoComentario = {
    id: novoId,
    post_id: postId,
    texto
  };

  comentarios.push(novoComentario);

  res.status(201).json(novoComentario);
});

app.delete('/comentarios/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = comentarios.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).send('Comentário não encontrado.');
  }

  comentarios.splice(index, 1);

  res.status(204).send(); 
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});