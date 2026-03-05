from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Semantic Search App"
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./app.db"

    embeddings_api_key: str = Field(default="", validation_alias=AliasChoices("EMBEDDINGS_API_KEY", "GITHUB_TOKEN", "TOKEN"))
    embeddings_model: str = Field(default="text-embedding-3-small", validation_alias=AliasChoices("EMBEDDINGS_MODEL", "EMBEDDING_MODEL"))
    embeddings_base_url: str = Field(default="https://models.inference.ai.azure.com", validation_alias=AliasChoices("EMBEDDINGS_BASE_URL"))

    llm_api_key: str = Field(default="", validation_alias=AliasChoices("LLM_API_KEY", "EMBEDDINGS_API_KEY", "GITHUB_TOKEN", "TOKEN"))
    llm_base_url: str = Field(
        default="https://models.inference.ai.azure.com",
        validation_alias=AliasChoices("LLM_BASE_URL", "EMBEDDINGS_BASE_URL"),
    )
    summary_model: str = Field(default="gpt-4o-mini", validation_alias=AliasChoices("SUMMARY_MODEL", "LLM_MODEL"))

    model_config = SettingsConfigDict(env_file=(".env", "backend/.env"), env_file_encoding="utf-8", extra="ignore")

    @field_validator(
        "embeddings_api_key",
        "embeddings_model",
        "embeddings_base_url",
        "llm_api_key",
        "llm_base_url",
        "summary_model",
        mode="before",
    )
    @classmethod
    def normalize_env_string(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip().strip('"').strip("'")
        return value


settings = Settings()
