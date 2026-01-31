function sendTask() {
  const task = document.getElementById("task").value;

  fetch("/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task })
  });

  alert("Task sent!");
}