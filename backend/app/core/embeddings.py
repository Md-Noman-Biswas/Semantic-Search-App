from typing import Any

import httpx

from app.core.config import settings


class EmbeddingError(Exception):
    pass


def generate_summary_embedding(summary_text: str) -> list[float]:
    if not settings.embeddings_api_key:
        raise EmbeddingError("Missing EMBEDDINGS_API_KEY / embeddings_api_key setting")

    endpoint = f"{settings.embeddings_base_url.rstrip('/')}/embeddings"
    payload: dict[str, Any] = {
        "model": settings.embeddings_model,
        "input": summary_text,
    }

    headers = {
        "Authorization": f"Bearer {settings.embeddings_api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = httpx.post(endpoint, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data["data"][0]["embedding"]
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as exc:
        raise EmbeddingError("Unable to generate summary embedding") from exc
