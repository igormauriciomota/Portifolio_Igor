from pathlib import Path
from uuid import uuid4

from flask import current_app
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename


IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
DOCUMENT_EXTENSIONS = {"pdf"}


def save_upload(file: FileStorage | None, folder: str, allowed_extensions: set[str]):
    """Valida extensão, gera nome único e grava o arquivo na pasta configurada."""

    if not file or not file.filename:
        return None

    safe_name = secure_filename(file.filename)
    extension = Path(safe_name).suffix.lower().lstrip(".")
    if extension not in allowed_extensions:
        raise ValueError(f"Formato .{extension or 'desconhecido'} não permitido.")

    filename = f"{uuid4().hex}.{extension}"
    destination = Path(current_app.config["UPLOAD_FOLDER"]) / folder
    destination.mkdir(parents=True, exist_ok=True)
    file.save(destination / filename)
    return f"{folder}/{filename}"
