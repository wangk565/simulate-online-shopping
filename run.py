from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
PACKAGE_JSON = PROJECT_ROOT / "package.json"
NODE_MODULES = PROJECT_ROOT / "node_modules"


def run_command(command: list[str]) -> int:
    process = subprocess.run(command, cwd=PROJECT_ROOT)
    return process.returncode


def ensure_npm_command() -> str:
    npm_command = "npm.cmd" if sys.platform.startswith("win") else "npm"

    if shutil.which(npm_command):
        return npm_command

    raise FileNotFoundError("未找到 npm，请先安装 Node.js。")


def install_dependencies(npm_command: str) -> None:
    print("正在安装依赖，请稍候...")
    exit_code = run_command([npm_command, "install"])
    if exit_code != 0:
        raise SystemExit(exit_code)


def start_dev_server(npm_command: str, host: str) -> None:
    print(f"正在启动开发服务器，访问地址通常是 http://{host}:5173")
    exit_code = run_command([npm_command, "run", "dev", "--", "--host", host])
    raise SystemExit(exit_code)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="启动 simulate-online-shopping 的前端开发服务器。"
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="开发服务器监听地址，默认是 127.0.0.1",
    )
    parser.add_argument(
        "--skip-install",
        action="store_true",
        help="跳过依赖安装检查，直接启动开发服务器。",
    )
    args = parser.parse_args()

    if not PACKAGE_JSON.exists():
        raise FileNotFoundError("未找到 package.json，请确认当前目录是项目根目录。")

    npm_command = ensure_npm_command()

    if not args.skip_install and not NODE_MODULES.exists():
        install_dependencies(npm_command)

    start_dev_server(npm_command, args.host)


if __name__ == "__main__":
    main()
