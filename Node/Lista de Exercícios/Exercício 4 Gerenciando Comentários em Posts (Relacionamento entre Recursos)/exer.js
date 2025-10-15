const express = require('express');
const app = express();

app.use(express.json());
 
let posts = [
  { id: 1, titulo: 'Primeiro Post', conteudo: 'Conteúdo do primeiro post...', autor: 'Carlos' },
  { id: 2, titulo: 'Segundo Post', conteudo: 'Olá, mundo!', autor: 'Ana' }
];

let comentarios = [
  { id: 1, post_id: 1, texto: 'Ótimo post!' },
  { id: 2, post_id: 2, texto: 'Concordo, muito bom.' }
];
 
app.get('/posts/:id/comentarios', (req, res) => {
  const postId = parseInt(req.params.id);
 
  const postExiste = posts.some(p => p.id === postId);
  if (!postExiste) {
    return res.status(404).json({ erro: 'Post não encontrado.' });
  }
 
  const comentariosDoPost = comentarios.filter(c => c.post_id === postId);
  res.json(comentariosDoPost);
});
 
app.post('/posts/:id/comentarios', (req, res) => {
  const postId = parseInt(req.params.id);
  const { texto } = req.body;
 
  const postExiste = posts.some(p => p.id === postId);
  if (!postExiste) {
    return res.status(404).json({ erro: 'Post não encontrado.' });
  }
 
  if (!texto || texto.trim() === '') {
    return res.status(400).json({ erro: 'Campo "texto" é obrigatório.' });
  }
 
  const novoComentario = {
    id: comentarios.length ? comentarios[comentarios.length - 1].id + 1 : 1,
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
    return res.status(404).json({ erro: 'Comentário não encontrado.' });
  }

  comentarios.splice(index, 1);
  res.json({ mensagem: 'Comentário deletado com sucesso.' });
});
 
app.listen(port, () => {
  console.log("Servidor rodando em http://localhost:" + port);
});