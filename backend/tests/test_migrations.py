from alembic.config import Config
from alembic import script


def test_alembic_revisions_exist():
    # Load Alembic config from local ini
    alembic_cfg = Config("alembic.ini")
    script_directory = script.ScriptDirectory.from_config(alembic_cfg)

    # Assert that at least one migration revision has been generated
    revisions = list(script_directory.walk_revisions())
    assert len(revisions) >= 1, "No Alembic database migrations found in versions directory."

    # Assert that current head points to a valid revision ID
    head_revision = script_directory.get_current_head()
    assert head_revision is not None
