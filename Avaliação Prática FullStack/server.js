const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

function horaParaMinutos(horario) {
  const [h, m] = horario.split(":").map(Number);
  return h * 60 + m;
}

app.post('/clientes', async (req, res) => {
  const { nome, endereco, telefone, email } = req.body;

  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  try {
    const [result] = await db.execute(
      'INSERT INTO clientes (nome, endereco, telefone, email) VALUES (?, ?, ?, ?)',
      [nome, endereco, telefone, email]
    );
    res.status(201).json({ id: result.insertId, nome, endereco, telefone, email });
  } catch (error) {
    console.error(error);
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
    if (rows.length === 0) return res.status(404).json({ error: "Cliente não encontrado" });
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
      'UPDATE clientes SET nome=?, endereco=?, telefone=?, email=? WHERE id=?',
      [nome, endereco, telefone, email, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente não encontrado" });

    res.json({ id, nome, endereco, telefone, email });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM clientes WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente não encontrado" });

    res.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover cliente' });
  }
});

app.post('/funcionarios', async (req, res) => {
  const { nome, especialidade, telefone, disponibilidade } = req.body;

  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

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

app.post('/servicos', async (req, res) => {
  const { nome, descricao, preco_base } = req.body;

  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

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

app.post('/status', async (req, res) => {
  const { descricao } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO status_agendamentos (descricao) VALUES (?)',
      [descricao]
    );
    res.status(201).json({ id: result.insertId, descricao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar status' });
  }
});


app.post('/agendamentos', async (req, res) => {
  const {
    id_cliente, id_funcionario, id_servico, id_status,
    data_agendamento, horario_inicio, horario_final, observacao
  } = req.body;

  if (!id_cliente || !id_funcionario || !id_servico || !data_agendamento || !horario_inicio)
    return res.status(400).json({ error: "Dados obrigatórios ausentes." });

  try {
    
    const [agendados] = await db.execute(
      `SELECT horario_inicio, horario_final FROM agendamentos
       WHERE id_funcionario = ? AND data_agendamento = ?`,
      [id_funcionario, data_agendamento]
    );

    const inicioNovo = horaParaMinutos(horario_inicio);
    const fimNovo = horario_final ? horaParaMinutos(horario_final) : inicioNovo + 60;

    const conflito = agendados.some(a => {
      const ini = horaParaMinutos(a.horario_inicio);
      const fim = horaParaMinutos(a.horario_final);
      return !(fimNovo <= ini || inicioNovo >= fim);
    });

    if (conflito)
      return res.status(400).json({
        error: "Conflito de horário: funcionário já possui agendamento nesse período."
      });

    const [result] = await db.execute(
      `INSERT INTO agendamentos 
      (id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_funcionario, id_servico, id_status, data_agendamento, horario_inicio, horario_final, observacao]
    );

    res.status(201).json({
      id: result.insertId,
      id_cliente, id_funcionario, id_servico, id_status,
      data_agendamento, horario_inicio, horario_final, observacao
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

app.get('/agendamentos', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        a.id, 
        c.nome AS cliente, 
        f.nome AS funcionario, 
        s.nome AS servico, 
        st.descricao AS status,
        a.data_agendamento, 
        a.horario_inicio, 
        a.horario_final, 
        a.observacao
      FROM agendamentos a
      JOIN clientes c ON c.id = a.id_cliente
      JOIN funcionarios f ON f.id = a.id_funcionario
      JOIN servicos s ON s.id = a.id_servico
      JOIN status_agendamentos st ON st.id = a.id_status
      ORDER BY a.data_agendamento, a.horario_inicio
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(port, () => {
  console.log(`Servidor rodando: http://localhost:${port}`);
});
