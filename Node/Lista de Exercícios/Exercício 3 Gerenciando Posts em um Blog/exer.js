const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let posts = [
    { id: 1, titulo: 'Primeiro Post', conteudo: 'Conteúdo do primeiro post..', autor: 'João' },
    { id: 2, titulo: 'Segundo Post', conteudo: 'Olá, mundo!', autor: 'Ana' }
  ];
  
  // Middleware para ler JSON no corpo das requisições
  app.use(express.json());
  
  /**
   * POST /posts - Criar novo post com validação
   */
  app.post('/posts', (req, res) => {
    const { titulo, conteudo, autor } = req.body;
  
    // Validação
    if (!titulo || !conteudo || !autor || titulo.trim() === '' || conteudo.trim() === '' || autor.trim() === '') {
      return res.status(400).send('As propriedades titulo, conteudo e autor são obrigatórias e não podem estar vazias.');
    }
  
    // Gera novo id
    const novoId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
  
    const novoPost = { id: novoId, titulo, conteudo, autor };
    posts.push(novoPost);
  
    res.status(201).json(novoPost);
  });
  
  /**
   * GET /posts/autor/:autor - Buscar posts por autor (case-insensitive)
   */
  app.get('/posts/autor/:autor', (req, res) => {
    const autorBusca = req.params.autor.toLowerCase();
  
    const postsDoAutor = posts.filter(post => post.autor.toLowerCase() === autorBusca);
  
    res.json(postsDoAutor);
  });
  
  /**
   * PATCH /posts/:id - Atualizar conteúdo de um post
   */
  app.patch('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { conteudo } = req.body;
  
    if (!conteudo || conteudo.trim() === '') {
      return res.status(400).send('O novo conteúdo deve ser fornecido e não pode estar vazio.');
    }
  
    const index = posts.findIndex(post => post.id === id);
  
    if (index === -1) {
      return res.status(404).send('Post não encontrado.');
    }
  
    posts[index].conteudo = conteudo;
  
    res.json(posts[index]);
  });

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});