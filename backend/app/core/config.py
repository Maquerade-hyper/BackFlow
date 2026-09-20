from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# backend/
BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # --------------------------------------------------------
    # Application
    # --------------------------------------------------------

    app_name: str = "BackFlow API"
    app_version: str = "0.1.0"
    environment: str = "development"

    # --------------------------------------------------------
    # Database
    # --------------------------------------------------------

    database_url: str = (
        "postgresql+psycopg2://"
        "backflow:backflow_dev@localhost:5434/backflow"
    )

    # --------------------------------------------------------
    # Authentication
    # --------------------------------------------------------

    jwt_secret: str = "change-this-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # --------------------------------------------------------
    # CORS
    # --------------------------------------------------------

    cors_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


settings = Settings()