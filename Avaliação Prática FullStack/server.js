const express = require('express');
const db = require('./db'); 
const app = express();
const port = 3000;

app.use(express.json());

//  Clientes
app.post('/clientes', async (req, res) => {
  const { nome, endereco, telefone, email } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO clientes (nome, endereco, telefone, email) VALUES (?, ?, ?, ?)',
      [nome, endereco, telefone, email]
    );
    res.status(201).json({ id: result.insertId, nome, endereco, telefone, email });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, endereco, telefone, email } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE clientes SET nome = ?, endereco = ?, telefone = ?, email = ? WHERE id = ?',
      [nome, endereco, telefone, email, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ id, nome, endereco, telefone, email });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM clientes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover cliente' });
  }
});

// Funcionarios
app.post('/funcionarios', async (req, res) => {
  const { nome, especialidade, telefone, disponibilidade } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO funcionarios (nome, especialidade, telefone, disponibilidade) VALUES (?, ?, ?, ?)',
      [nome, especialidade, telefone, disponibilidade]
    );
    res.status(201).json({ id: result.insertId, nome, especialidade, telefone, disponibilidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
});

app.get('/funcionarios', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM funcionarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

app.get('/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM funcionarios WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
});

app.put('/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, especialidade, telefone, disponibilidade } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE funcionarios SET nome = ?, especialidade = ?, telefone = ?, disponibilidade = ? WHERE id = ?',
      [nome, especialidade, telefone, disponibilidade, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json({ id, nome, especialidade, telefone, disponibilidade });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

app.delete('/funcionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM funcionarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover funcionário' });
  }
});


// Serviços
app.post('/servicos', async (req, res) => {
  const { nome, descricao, preco_base } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO servicos (nome, descricao, preco_base) VALUES (?, ?, ?)',
      [nome, descricao, preco_base]
    );
    res.status(201).json({ id: result.insertId, nome, descricao, preco_base });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
});

app.get('/servicos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM servicos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

app.get('/servicos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM servicos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
});

app.put('/servicos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco_base } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE servicos SET nome = ?, descricao = ?, preco_base = ? WHERE id = ?',
      [nome, descricao, preco_base, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json({ id, nome, descricao, preco_base });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

app.delete('/servicos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM servicos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover serviço' });
  }
});

//  Status
app.post('/status', async (req, res) => {
  const { descricao } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO status_agendamentos (descricao) VALUES (?)', [descricao]);
    res.status(201).json({ id: result.insertId, descricao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar status' });
  }
});

app.get('/status', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM status_agendamentos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

app.put('/status/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE status_agendamentos SET descricao = ? WHERE id = ?',
      [descricao, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Status não encontrado' });
    res.json({ id, descricao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

app.delete('/status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM status_agendamentos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Status não encontrado' });
    res.json({ message: 'Status removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover status' });
  }
});


// Agendamentos
app.post('/agendamentos', async (req, res) => {
  const { id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO agendamentos (id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao]
    );
    res.status(201).json({ id: result.insertId, id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});


app.get('/agendamentos', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.id, c.nome AS cliente, f.nome AS funcionario, s.nome AS servico, st.descricao AS status,
             a.data_agendamento, a.horario_inicio, a.horario_final, a.observacao
      FROM agendamentos a
      JOIN clientes c ON a.id_cliente = c.id
      JOIN funcionarios f ON a.id_funcionario = f.id
      JOIN servicos s ON a.id_servico = s.id
      JOIN status_agendamentos st ON a.id_status = st.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

app.get('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(`
      SELECT a.id, c.nome AS cliente, f.nome AS funcionario, s.nome AS servico, st.descricao AS status,
             a.data_agendamento, a.horario_inicio, a.horario_final, a.observacao
      FROM agendamentos a
      JOIN clientes c ON a.id_cliente = c.id
      JOIN funcionarios f ON a.id_funcionario = f.id
      JOIN servicos s ON a.id_servico = s.id
      JOIN status_agendamentos st ON a.id_status = st.id
      WHERE a.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
});

app.put('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao } = req.body;
  try {
    const [result] = await db.execute(`
      UPDATE agendamentos SET id_cliente=?, id_funcionario=?, id_servico=?, id_status=?, data_agendamento=?, horario_inicio=?, horario_final=?, observacao=?
      WHERE id=?
    `, [id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json({ id, id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

app.delete('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM agendamentos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json({ message: 'Agendamento removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover agendamento' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
