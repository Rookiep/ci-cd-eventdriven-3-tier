function sendTask() {
  const task = document.getElementById('task').value;
  fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  })
  .then(res => res.json())
  .then(data => alert(JSON.stringify(data)))
  .catch(err => alert(err));
}