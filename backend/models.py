from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from database import Base


class TierList(Base):
    __tablename__ = "tier_lists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship(
        "Item", back_populates="tier_list", cascade="all, delete-orphan"
    )


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    tier_list_id = Column(Integer, ForeignKey("tier_lists.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    creator = Column(String)
    artwork_url = Column(String)
    tier = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tier_list = relationship("TierList", back_populates="items")
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
