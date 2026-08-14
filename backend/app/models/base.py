from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Boolean
from app.core.database import Base


class TenantBaseModel(Base):
    __abstract__ = True

    # Multi-tenant partitioning field
    tenant_id = Column(String(50), nullable=False, index=True)

    # Audit tracking fields
    created_by = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_by = Column(String(50), nullable=True)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Soft delete fields
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
