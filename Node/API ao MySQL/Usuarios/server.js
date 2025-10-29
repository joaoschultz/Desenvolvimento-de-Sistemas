const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());

app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios ORDER BY idUsuario ASC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuarios:', error);
    res.status(500).send('Erro interno do servidor ao buscar usuarios.');
  }
});

app.get('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Usuário não encontrado.');
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao buscar usuário.');
  }
});

let usuarios = [
  { id: 1, nome: 'Rodrigo', idade: 19 },
  { id: 2, nome: 'Gabriel', idade: 20 },
  { id: 3, nome: 'João', idade: 20 },
];

app.post('/usuarios', async (req, res) => {
  const { nome, idade } = req.body;

  if (!nome || !idade) {
    return res.status(400).json({ error: 'Nome e idade são obrigatórios.' });
  }

  try {
    const [result] = await db.query('INSERT INTO usuarios (nome, idade) VALUES (?, ?)', [nome, idade]);
    const novoUsuario = { idUsuario: result.insertId, nome, idade };
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro interno do servidor ao criar usuário.');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, idade } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  if (!nome || !idade) {
    return res.status(400).json({ error: 'Nome e idade são obrigatórios para atualizar.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE usuarios SET nome = ?, idade = ? WHERE idUsuario = ?',
      [nome, idade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ idUsuario: id, nome, idade });
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar usuário.' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {

    const [result] = await db.query('DELETE FROM usuarios WHERE idUsuario = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ message: `Usuário com ID ${id} foi removido com sucesso.` });
  } catch (error) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar usuário.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});