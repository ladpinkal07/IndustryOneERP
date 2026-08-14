from app.core.config import settings


def test_config_loads_testing_env():
    # Assert that environment parameters override default settings
    assert settings.APP_ENV == "testing"
    assert settings.DATABASE_URL.endswith("industryone_erp_test")
    assert settings.JWT_SECRET_KEY.endswith("_test")
    assert settings.GEMINI_API_KEY == "test_mock_gemini_api_key"
