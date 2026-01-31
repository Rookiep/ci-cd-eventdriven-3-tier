async function sendTask() {
  const task = document.getElementById("task").value;

  if (!task) {
    alert("Please enter a task");
    return;
  }

  await fetch("http://api:3000/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ task })
  });

  alert("Task sent to queue!");
}
