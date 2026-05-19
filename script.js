let pyodideReady = false;
let pyodide;

// Upgraded curriculum from Basic to Advanced
const lessonsData = {
    "1": {
        "title": "1. Variables & Data Types",
        "instructions": "<h3>Theory:</h3>In Python, variables are containers for storing data values. Unlike other languages, you don't need to declare their type. Python automatically understands text (strings), integers, and decimals (floats).<br><br><b>Mission:</b> Create a variable named <code>hero</code> and assign your name to it, then print it out.",
        "placeholder": "# Define your variables below\nhero = \"Anya\"\nage = 22\n\nprint(\"Hero Name:\", hero)\nprint(\"Hero Age:\", age)"
    },
    "2": {
        "title": "2. String Manipulation",
        "instructions": "<h3>Theory:</h3>Strings are text surrounded by quotes. You can join strings together using the <code>+</code> operator (called concatenation) or format them cleanly using <code>f-strings</code> like this: <code>f\"Hello {variable}\"</code>.<br><br><b>Mission:</b> Modify the f-string template below to create your own message.",
        "placeholder": "item = \"Golden Sword\"\nquantity = 3\n\n# Using an f-string for easy formatting\nmessage = f\"You found {quantity}x {item} in the chest!\"\nprint(message)"
    },
    "3": {
        "title": "3. Basic Math Operators",
        "instructions": "<h3>Theory:</h3>Python uses standard operators: <code>+</code> (add), <code>-</code> (subtract), <code>*</code> (multiply), <code>/</code> (divide), and <code>**</code> (exponent/power).<br><br><b>Mission:</b> Calculate the area of a square with a side length of 15 using the exponent operator.",
        "placeholder": "side = 15\n# Hint: side squared is side ** 2\narea = side ** 2\n\nprint(\"The area of the square is:\", area)"
    },
    "4": {
        "title": "4. Conditionals (If/Else)",
        "instructions": "<h3>Theory:</h3>Conditionals let your code make decisions using <code>if</code>, <code>elif</code> (else if), and <code>else</code>. Python relies on <b>indentation</b> (tabs/spaces) to know what code belongs inside the condition.<br><br><b>Mission:</b> Change the score value to 45 and run the code to see the 'Game Over' logic kick in.",
        "placeholder": "score = 85\n\nif score >= 80:\n    print(\"Rank: S Class! ⭐\")\nelif score >= 50:\n    print(\"Rank: Passing Class! 👍\")\nelse:\n    print(\"Rank: Game Over 💀\")"
    },
    "5": {
        "title": "5. For Loops",
        "instructions": "<h3>Theory:</h3>Loops repeat a block of code. A <code>for</code> loop is used to iterate over a sequence (like a list) or a range of numbers using the <code>range()</code> function.<br><br><b>Mission:</b> Run the code to watch Python count, then try changing the range parameters.",
        "placeholder": "# range(start, stop)\nprint(\"Counting down for launch:\")\nfor i in range(5, 0, -1):\n    print(f\"{i}...\")\nprint(\"Blast off! 🚀\")"
    },
    "6": {
        "title": "6. While Loops",
        "instructions": "<h3>Theory:</h3>A <code>while</code> loop repeats as long as a certain condition remains <code>True</code>. Be careful! If the condition never becomes False, you will create an infinite loop.<br><br><b>Mission:</b> See how the loop uses a tracker variable to safely exit.",
        "placeholder": "energy = 100\nprint(\"Running marathon...\")\n\nwhile energy > 0:\n    print(f\"Still running! Energy level: {energy}%\")\n    energy -= 25 # Drain energy\n\nprint(\"Collapsed at the finish line! 🎉\")"
    },
    "7": {
        "title": "7. Lists & Collections",
        "instructions": "<h3>Theory:</h3>Lists are used to store multiple items in a single variable. They are ordered, changeable, and indexed starting from <code>0</code>. You can add items using <code>.append()</code>.<br><br><b>Mission:</b> Add a fourth item to the inventory list using code.",
        "placeholder": "inventory = [\"Potion\", \"Shield\", \"Key\"]\n\n# Add an item\ninventory.append(\"Grappling Hook\")\n\nprint(\"Your Inventory items:\")\nfor item in inventory:\n    print(f\"- {item}\")"
    },
    "8": {
        "title": "8. Functions",
        "instructions": "<h3>Theory:</h3>A function is a reusable block of code that only runs when it is called. You define a function using the <code>def</code> keyword and pass data into it via parameters.<br><br><b>Mission:</b> Call the function a third time using your own custom parameters.",
        "placeholder": "def calculate_damage(base_attack, multiplier):\n    return base_attack * multiplier\n\n# Calling the function\nplayer_hit = calculate_damage(12, 1.5)\nprint(f\"Critical Hit Damage: {player_hit}!\")"
    },
    "9": {
        "title": "9. Error Handling (Try/Except)",
        "instructions": "<h3>Theory:</h3>When an error occurs, Python normally stops and prints an error message. You can prevent crashes by catching exceptions using <code>try</code> and <code>except</code> blocks.<br><br><b>Mission:</b> Change the denominator <code>y</code> to 0 to see how the code safely intercepts a ZeroDivisionError.",
        "placeholder": "x = 10\ny = 2 # Change this to 0 to trigger the exception\n\ntry:\n    result = x / y\n    print(f\"Result is {result}\")\nexcept ZeroDivisionError:\n    print(\"❌ Error: You cannot divide a number by zero!\")"
    },
    "10": {
        "title": "10. Advanced: OOP (Classes & Objects)",
        "instructions": "<h3>Theory:</h3>Python is an Object-Oriented Programming language. A <code>class</code> is like a blueprint, and an <code>object</code> is an instance created from that blueprint. The <code>__init__</code> method acts as the constructor.<br><br><b>Mission:</b> Run this code to see how objects hold unique state properties, then create a second wizard object named 'Gollum'.",
        "placeholder": "class Wizard:\n    def __init__(self, name, spell):\n        self.name = name\n        self.spell = spell\n\n    def cast(self):\n        return f\"🧙‍♂️ {self.name} casts {self.spell}!\"\n\n# Instantiate an object\nmerlin = Wizard(\"Merlin\", \"Fireball\")\nprint(merlin.cast())"
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const outputElement = document.getElementById("terminal-output");
    outputElement.innerText = "Initializing Python engine... Please wait.";
    
    try {
        await loadScript("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
        pyodide = await loadPyodide();
        pyodideReady = true;
        outputElement.innerText = "Python engine ready! Select a lesson to begin your journey.";
        renderLessons();
    } catch (error) {
        outputElement.innerText = "Failed to load Python environment. Check internet connection.";
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
    document.getElementById("lesson-text").innerHTML = lesson.instructions;
    document.getElementById("code-editor").value = lesson.placeholder;
    document.getElementById("run-btn").disabled = !pyodideReady;
}

document.getElementById("run-btn").onclick = async () => {
    if (!pyodideReady) return;
    const code = document.getElementById("code-editor").value;
    const outputElement = document.getElementById("terminal-output");
    outputElement.innerText = "Running script...";

    try {
        pyodide.runPython(`
            import sys
            import io
            sys.stdout = io.StringIO()
        `);
        await pyodide.runPythonAsync(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        outputElement.innerText = stdout || "Code ran successfully with no print output.";
    } catch (error) {
        outputElement.innerText = `Runtime Error:\n${error.message}`;
    }
};
