#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import sys
import os

if len(sys.argv) > 1:
    path = sys.argv[1]
    os.chdir(path)
print "serving from", os.getcwd()

PORT = 8080

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
