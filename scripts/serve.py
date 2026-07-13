#!/usr/bin/env python3
"""Local dev server for Grimoire.

Same as `python -m http.server`, but sends no-cache headers so edits to
app.js / style.css show up on a normal refresh — no hard-reload needed.
Serves the current working directory (the launchers cd to the project root
first). Usage: python scripts/serve.py [port]
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
    print(f"Grimoire serving http://localhost:{port} (no-cache)")
    HTTPServer(("", port), NoCacheHandler).serve_forever()
