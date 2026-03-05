import re
from html import unescape
from typing import Any

import httpx

from app.core.config import settings


class SummaryError(Exception):
    pass


def _to_plain_text(html_content: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html_content or "")
    text = unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def generate_summary(title: str, description_html: str) -> str:
    if not settings.llm_api_key:
        raise SummaryError("Missing LLM_API_KEY / EMBEDDINGS_API_KEY / GITHUB_TOKEN setting")

    description_text = _to_plain_text(description_html)
    if not description_text:
        raise SummaryError("Cannot generate summary from empty description")

    endpoint = f"{settings.llm_base_url.rstrip('/')}/chat/completions"
    payload: dict[str, Any] = {
        "model": settings.summary_model,
        "messages": [
            {
                "role": "system",
                "content": "You create concise factual document summaries in 2-4 sentences.",
            },
            {
                "role": "user",
                "content": f"Title: {title}\n\nDescription:\n{description_text}\n\nWrite a concise summary.",
            },
        ],
        "temperature": 0.2,
        "max_tokens": 180,
    }

    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = httpx.post(endpoint, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        text = data["choices"][0]["message"]["content"]
        cleaned = text.strip()
        if not cleaned:
            raise SummaryError("Model returned an empty summary")
        return cleaned
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as exc:
        raise SummaryError("Unable to generate summary") from exc


def generate_summary_fallback(title: str, description_html: str) -> str:
    description_text = _to_plain_text(description_html)
    base_text = description_text or title.strip() or "No description available"
    if len(base_text) <= 240:
        return base_text
    return f"{base_text[:237].rstrip()}..."
