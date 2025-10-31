#!/bin/bash
cd /home/daytona/template
HOST_VALUE="${HOST:-0.0.0.0}"
PORT_VALUE="${PORT:-3000}"

HOST="$HOST_VALUE" PORT="$PORT_VALUE" npm run dev -- --host "$HOST_VALUE" --port "$PORT_VALUE"
