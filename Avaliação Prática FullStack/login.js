document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    const res = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, senha })
    });
  
    const data = await res.json();
    if(res.ok) {
      window.location.href = '/dashboard.html';
    } else {
      document.getElementById('mensagem').innerText = data.error;
    }
  });
  