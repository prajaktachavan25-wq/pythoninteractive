let pyodideReady = false;
let pyodide;

const lessonsData = {
    "1": {
        "title": "1. Variables & Printing",
        "instructions": "In Python, you create a variable just by assigning it a value. Use the `print()` function to output it.",
        "placeholder": "name = \"Alice\"\nprint(\"Hello, \" + name)"
    },
    "2": {
        "title": "2. Basic Math",
        "instructions": "Python can be used as a calculator. Try changing the numbers and printing the result of a multiplication (*).",
        "placeholder": "x = 5\ny = 10\nprint(x * y)"
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const outputElement = document.getElementById("terminal-output");
    outputElement.innerText = "Initializing Python engine... Please wait.";
    
    try {
        await loadScript("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
        pyodide = await loadPyodide();
        pyodideReady = true;
        outputElement.innerText = "Python engine ready! Select a lesson to begin.";
        renderLessons();
    } catch (error) {
        outputElement.innerText = "Failed to load Python environment.";
    }
});

function loadScript(url) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

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
    document.querySelectorAll("#lesson-list li").forEach(li => li.classList.remove("active"));
    element.classList.add("active");
    const lesson = lessonsData[id];
    document.getElementById("lesson-title").innerText = lesson.title;
    document.getElementById("lesson-text").innerText = lesson.instructions;
    document.getElementById("code-editor").value = lesson.placeholder;
    document.getElementById("run-btn").disabled = !pyodideReady;
}

document.getElementById("run-btn").onclick = async () => {
    if (!pyodideReady) return;
    const code = document.getElementById("code-editor").value;
    const outputElement = document.getElementById("terminal-output");
    outputElement.innerText = "Running...";

    try {
        pyodide.runPython(`
            import sys
            import io
            sys.stdout = io.StringIO()
        `);
        await pyodide.runPythonAsync(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        outputElement.innerText = stdout || "Code ran successfully with no output.";
    } catch (error) {
        outputElement.innerText = `Error:\n${error.message}`;
    }
};
