from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Semantic Search App"
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./app.db"
    embeddings_api_key: str = ""
    github_token: str = ""
    embeddings_model: str = "text-embedding-3-small"
    embeddings_base_url: str = "https://models.inference.ai.azure.com"
    summary_model: str = "gpt-4o-mini"
    llm_base_url: str = "https://models.inference.ai.azure.com"

    model_config = SettingsConfigDict(
        env_file=(Path(__file__).resolve().parents[2] / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
