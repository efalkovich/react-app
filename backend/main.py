import uvicorn
import os

from dotenv import load_dotenv

from app import create_app

load_dotenv(verbose=True, dotenv_path=".env")

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=5435, log_level="info", reload=True, reload_dirs=["app"])
else:
    app = create_app()