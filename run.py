
import http.server
import socketserver
import webbrowser
import os

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Change directory to where this script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"Starting your Python learning server at http://localhost:{PORT}")
print("Do not close this window while using the website!")

# Automatically open the interactive page in your browser
webbrowser.open(f"http://localhost:{PORT}/index.html")

# Run the built-in python server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
