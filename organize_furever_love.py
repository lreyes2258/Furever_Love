#!/usr/bin/env python3
"""
Split the Furever_Love repo into frontend/ and backend/ folders.

Run from the repository root:
    python organize_furever_love.py --dry-run
    python organize_furever_love.py

What it does:
- Creates frontend/ and backend/
- Moves Expo/React Native files into frontend/
- Moves API/database files into backend/
- Creates separate frontend/package.json and backend/package.json with the deps each side needs
- Leaves the original root package.json/package-lock.json in place as backups unless --remove-root-manifests is used
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path
from typing import Iterable

FRONTEND_PATHS = [
    "App.js",
    "app.jsx",
    "index.js",
    "app.json",
    "AuthContext.jsx",
    "assets",
    "src",
    ".expo",
]

BACKEND_PATHS = [
    "backendServer.js",
    "Furever_Love.sql",
    ".env",
]

FRONTEND_DEPS = [
    "@expo/vector-icons",
    "@react-native-async-storage/async-storage",
    "@react-navigation/native",
    "@react-navigation/native-stack",
    "expo",
    "expo-status-bar",
    "react",
    "react-native",
    "react-native-paper",
    "react-native-safe-area-context",
    "react-native-screens",
]

BACKEND_DEPS = [
    "bcryptjs",
    "cors",
    "dotenv",
    "express",
    "jsonwebtoken",
    "mysql2",
    "nodemailer",
]

ROOT_FILES_TO_COPY = [
    ".gitignore",
    "README.md",
]


def load_package_json(root: Path) -> dict:
    package_path = root / "package.json"
    if not package_path.exists():
        raise FileNotFoundError("package.json not found. Run this script from the repo root.")
    return json.loads(package_path.read_text(encoding="utf-8"))


def pick_deps(all_deps: dict, names: Iterable[str]) -> dict:
    return {name: all_deps[name] for name in names if name in all_deps}


def safe_move(src: Path, dst: Path, dry_run: bool, force: bool) -> None:
    if not src.exists():
        print(f"skip missing: {src.name}")
        return
    if dst.exists():
        if not force:
            print(f"skip exists: {dst} (use --force to overwrite)")
            return
        if not dry_run:
            if dst.is_dir():
                shutil.rmtree(dst)
            else:
                dst.unlink()
    print(f"move: {src} -> {dst}")
    if not dry_run:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))


def safe_copy(src: Path, dst: Path, dry_run: bool, force: bool) -> None:
    if not src.exists():
        return
    if dst.exists() and not force:
        print(f"skip exists: {dst} (use --force to overwrite)")
        return
    print(f"copy: {src} -> {dst}")
    if not dry_run:
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)


def write_json(path: Path, data: dict, dry_run: bool, force: bool) -> None:
    if path.exists() and not force:
        print(f"skip exists: {path} (use --force to overwrite)")
        return
    print(f"write: {path}")
    if not dry_run:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Split repo into frontend and backend folders.")
    parser.add_argument("--root", default=".", help="Repository root. Defaults to current directory.")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without writing anything.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing destination files/folders.")
    parser.add_argument(
        "--remove-root-manifests",
        action="store_true",
        help="Remove root package.json and package-lock.json after creating split manifests.",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    frontend = root / "frontend"
    backend = root / "backend"
    pkg = load_package_json(root)
    all_deps = pkg.get("dependencies", {})
    all_dev_deps = pkg.get("devDependencies", {})

    print(f"repo root: {root}")
    print(f"dry run: {args.dry_run}")

    if not args.dry_run:
        frontend.mkdir(exist_ok=True)
        backend.mkdir(exist_ok=True)

    for rel in FRONTEND_PATHS:
        safe_move(root / rel, frontend / rel, args.dry_run, args.force)

    for rel in BACKEND_PATHS:
        safe_move(root / rel, backend / rel, args.dry_run, args.force)

    for rel in ROOT_FILES_TO_COPY:
        safe_copy(root / rel, frontend / rel, args.dry_run, args.force)
        safe_copy(root / rel, backend / rel, args.dry_run, args.force)

    frontend_pkg = {
        "private": True,
        "main": "index.js",
        "scripts": {
            "start": "expo start",
            "android": "expo start --android",
            "ios": "expo start --ios",
            "web": "expo start --web",
        },
        "dependencies": pick_deps(all_deps, FRONTEND_DEPS),
    }
    if all_dev_deps:
        frontend_pkg["devDependencies"] = all_dev_deps

    backend_pkg = {
        "private": True,
        "main": "backendServer.js",
        "scripts": {
            "start": "node backendServer.js",
            "dev": "node backendServer.js",
        },
        "dependencies": pick_deps(all_deps, BACKEND_DEPS),
    }

    write_json(frontend / "package.json", frontend_pkg, args.dry_run, args.force)
    write_json(backend / "package.json", backend_pkg, args.dry_run, args.force)

    backend_env_example = """PORT=4000
JWT_SECRET=replace-me
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=Furever_Love
DB_PORT=3306
APP_BASE_URL=http://0.0.0.0:4000
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
DAILY_LIKE_LIMIT=10
"""
    if not (backend / ".env.example").exists() or args.force:
        print(f"write: {backend / '.env.example'}")
        if not args.dry_run:
            (backend / ".env.example").write_text(backend_env_example, encoding="utf-8")

    if args.remove_root_manifests:
        for rel in ["package.json", "package-lock.json"]:
            target = root / rel
            if target.exists():
                print(f"remove: {target}")
                if not args.dry_run:
                    target.unlink()

    print("\nDone. Next steps:")
    print("  cd frontend && npm install")
    print("  cd ../backend && npm install")
    print("  cd ../frontend && npm start")
    print("  cd ../backend && npm start")


if __name__ == "__main__":
    main()
