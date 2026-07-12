from datetime import datetime

from pydantic import BaseModel


class ItemBase(BaseModel):
    title: str
    type: str
    creator: str | None = None
    artwork_url: str | None = None
    tier: str | None = None


class ItemCreate(ItemBase):
    pass


class ItemUpdateTier(BaseModel):
    tier: str | None = None


class Item(ItemBase):
    id: int

    class Config:
        from_attributes = True


class TierHistoryOut(BaseModel):
    id: int
    old_tier: str | None
    new_tier: str | None
    changed_at: datetime

    class Config:
        from_attributes = True
