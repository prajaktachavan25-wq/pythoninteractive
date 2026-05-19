const API_URL = "http://127.0.0.1:8000/api";
let lessonsData = {};

// Fetch lessons from the backend on load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${API_URL}/lessons`);
        lessonsData = await response.json();
        renderLessons();
    } catch (error) {
        console.error("Failed to fetch lessons:", error);
        document.getElementById("lesson-text").innerText = "Failed to connect to backend server.";
    }
});

function renderLessons() {
    const list = document.getElementById("lesson-list");
    list.innerHTML = "";
    
    Object.keys(lessonsData).forEach(id => {
        const li = document.createElement("li");
        li.innerText = lessonsData[id].title;
        li.onclick = () => selectLesson(id, li);
        list.appendChild(li);
    });
}

function selectLesson(id, element) {
    // Manage active visual state
    document.querySelectorAll("#lesson-list li").forEach(li => li.classList.remove("active"));
    element.classList.add("active");

    // Populate data
    const lesson = lessonsData[id];
    document.getElementById("lesson-title").innerText = lesson.title;
    document.getElementById("lesson-text").innerText = lesson.instructions;
    document.getElementById("code-editor").value = lesson.placeholder;
    
    // Enable run button
    document.getElementById("run-btn").disabled = false;
}

// Handle running code
document.getElementById("run-btn").onclick = async () => {
    const code = document.getElementById("code-editor").value;
    const outputElement = document.getElementById("terminal-output");
    outputElement.innerText = "Running code...";

    try {
        const response = await fetch(`${API_URL}/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
        });
        const data = await response.json();
        outputElement.innerText = data.output;
    } catch (error) {
        outputElement.innerText = "Error connecting to the execution server.";
    }
};
