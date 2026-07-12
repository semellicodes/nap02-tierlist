from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "filme" ou "album"
    creator = Column(String)  # diretor ou artista
    artwork_url = Column(String)
    tier = Column(String)  # None = ainda não classificado (fica no pool)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    history = relationship(
        "TierHistory", back_populates="item", cascade="all, delete-orphan"
    )


class TierHistory(Base):
    __tablename__ = "tier_history"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    old_tier = Column(String)
    new_tier = Column(String)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

    item = relationship("Item", back_populates="history")
