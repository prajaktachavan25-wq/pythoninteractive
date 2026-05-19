from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import io

app = FastAPI()

# Allow your frontend to talk to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database of lessons
LESSONS = {
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
}

class CodeSubmission(BaseModel):
    code: str

@app.get("/api/lessons")
def get_lessons():
    return LESSONS

@app.post("/api/run")
def run_code(submission: CodeSubmission):
    # Redirect standard output to capture print statements
    old_stdout = sys.stdout
    new_stdout = io.StringIO()
    sys.stdout = new_stdout
    
    try:
        # Execute the user's code
        # WARNING: exec() is dangerous in production without sandboxing
        exec(submission.code, {"__builtins__": __builtins__}, {})
        output = new_stdout.getvalue()
    except Exception as e:
        output = f"Error: {str(e)}"
    finally:
        # Always restore standard output
        sys.stdout = old_stdout
        
    return {"output": output if output else "Code ran successfully with no output."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
