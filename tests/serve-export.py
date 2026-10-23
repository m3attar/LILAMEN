"""Serve the production export for local QA, including the custom 404 page."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
import argparse

root = Path(__file__).resolve().parents[1] / 'out'
base_path = ''
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)
    def translate_path(self, path):
        parts = urlsplit(path)
        if base_path:
            if parts.path == base_path or parts.path.startswith(base_path + "/"):
                path = urlunsplit(("", "", parts.path[len(base_path):] or "/", parts.query, ""))
            else:
                path = "/__outside_preview_mount__"
        return super().translate_path(path)
    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        content = (root / '404.html').read_bytes()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        if self.command != 'HEAD': self.wfile.write(content)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-path', default='', help='Match a static hosting prefix, e.g. /LILAMEN')
    args = parser.parse_args()
    base_path = args.base_path.rstrip('/')
    ThreadingHTTPServer(('0.0.0.0', 3000), Handler).serve_forever()
