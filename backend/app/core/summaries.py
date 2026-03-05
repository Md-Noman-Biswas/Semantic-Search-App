import re
from typing import Any

import httpx

from app.core.config import settings


class SummaryGenerationError(Exception):
    pass


def strip_html(raw_html: str) -> str:
    without_tags = re.sub(r"<[^>]*>", " ", raw_html)
    return re.sub(r"\s+", " ", without_tags).strip()


def generate_document_summary(title: str, description: str) -> str:
    api_key = settings.github_token or settings.embeddings_api_key
    if not api_key:
        raise SummaryGenerationError("Missing GITHUB_TOKEN or EMBEDDINGS_API_KEY")

    description_text = strip_html(description)
    if not description_text:
        raise SummaryGenerationError("Description is empty")

    endpoint = f"{settings.llm_base_url.rstrip('/')}/chat/completions"
    payload: dict[str, Any] = {
        "model": settings.summary_model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an assistant that writes concise document summaries. "
                    "Return plain text only and keep it under 60 words."
                ),
            },
            {
                "role": "user",
                "content": f"Title: {title}\n\nDocument:\n{description_text}\n\nCreate a short summary.",
            },
        ],
        "temperature": 0.3,
        "max_tokens": 140,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = httpx.post(endpoint, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        summary = data["choices"][0]["message"]["content"].strip()
        if not summary:
            raise SummaryGenerationError("Model returned an empty summary")
        return summary
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as exc:
        raise SummaryGenerationError("Unable to generate summary") from exc
