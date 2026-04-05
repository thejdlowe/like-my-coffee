"""
uwebsockets/client.py
Pico W-compatible replacement for the danni/uwebsockets client.
Removes dependencies on ussl, logging, and urandom which don't
exist on the Pico W. Uses only modules available in MicroPython
for the RP2040.

Drop this into the uwebsockets/ folder on your Pico, replacing
the existing client.py.
"""

import socket
import binascii
import os

from .protocol import Websocket, urlparse


class WebsocketClient(Websocket):
    is_client = True


def connect(uri):
    """Connect to a WebSocket server. Returns a Websocket instance."""
    uri = urlparse(uri)
    assert uri

    sock = socket.socket()
    addr = socket.getaddrinfo(uri.hostname, uri.port)
    sock.connect(addr[0][4])

    # wss:// is not supported — we're on a local network so plain ws:// is fine
    if uri.protocol == 'wss':
        raise NotImplementedError("wss:// is not supported on Pico W with this client")

    # Build the WebSocket upgrade handshake
    # The key just needs to be a random-ish base64 string; os.urandom works on Pico W
    key = binascii.b2a_base64(os.urandom(16)).strip()

    handshake = (
        f"GET {uri.path or '/'} HTTP/1.1\r\n"
        f"Host: {uri.hostname}:{uri.port}\r\n"
        f"Upgrade: websocket\r\n"
        f"Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key.decode()}\r\n"
        f"Sec-WebSocket-Version: 13\r\n"
        f"\r\n"
    )

    sock.send(handshake.encode())

    # Read the HTTP response headers until we hit the blank line
    header = b""
    while True:
        byte = sock.recv(1)
        header += byte
        if header.endswith(b"\r\n\r\n"):
            break

    # Make sure the server agreed to upgrade
    if b"101" not in header:
        raise Exception(f"WebSocket upgrade failed:\n{header.decode()}")

    return WebsocketClient(sock)