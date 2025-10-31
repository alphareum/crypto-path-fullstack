#!/usr/bin/env python3
import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
cfg_path = os.path.join(os.path.dirname(ROOT), "stack.config.json")
out_path = os.path.join(os.path.dirname(ROOT), "..", "skill-rules.json")

with open(cfg_path, "r", encoding="utf-8") as f:
    cfg = json.load(f)

def first(x):
    return x[0] if isinstance(x, list) and x else x

rules = []
fg = first(cfg.get("frontend_globs"))
bg = first(cfg.get("backend_globs"))
tg = first(cfg.get("test_globs"))

if fg: rules.append({"match": {"path_glob": fg}, "skills": ["frontend"]})
if bg: rules.append({"match": {"path_glob": bg}, "skills": ["backend-node","backend-python","backend-go"]})
if tg: rules.append({"match": {"path_glob": tg}, "skills": ["testing-js","testing-py"]})

dbk = cfg.get("db_indicators") or []
if dbk:
    rules.append({"match": {"keywords": dbk}, "skills": ["db-prisma","db-sqlalchemy"]})

rules.append({"match": {"path_glob": "**/*"}, "skills": ["security"]})

with open(out_path, "w", encoding="utf-8") as f:
    json.dump({"rules": rules}, f, indent=2)

print(f"Wrote {out_path}")
