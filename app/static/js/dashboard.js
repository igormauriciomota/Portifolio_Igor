document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#tech-chart");
  if (!canvas || typeof Chart === "undefined") return;
  const labels = JSON.parse(canvas.dataset.labels || "[]");
  const values = JSON.parse(canvas.dataset.values || "[]");
  new Chart(canvas, { type:"doughnut", data:{ labels, datasets:[{ data:values, backgroundColor:["#44c8ff","#1677ff","#f2be63","#54ddb1","#7b61ff","#ff7c74","#5fd1c8","#9cadc2"], borderWidth:0 }] }, options:{ responsive:true, plugins:{ legend:{ position:"bottom", labels:{ color:"#9cadc2", padding:16 } } } } });
});

