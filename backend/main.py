from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from auth import get_current_user_id
from database import Base, engine, get_db
from media_search import router as media_search_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NAP 02 - Tier List API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media_search_router)

VALID_TIERS = {"S", "A", "B", "C", "D"}


def _get_owned_item(item_id: int, user_id: str, db: Session) -> models.Item:
    item = (
        db.query(models.Item)
        .filter(models.Item.id == item_id, models.Item.user_id == user_id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return item


@app.get("/items", response_model=list[schemas.Item])
def listar_items(
    db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)
):
    return db.query(models.Item).filter(models.Item.user_id == user_id).all()


@app.post("/items", response_model=schemas.Item, status_code=201)
def criar_item(
    item: schemas.ItemCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if item.tier not in VALID_TIERS:
        raise HTTPException(status_code=422, detail="Tier inválido")
    novo_item = models.Item(**item.model_dump(), user_id=user_id)
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    db.add(
        models.TierHistory(
            item_id=novo_item.id, old_tier=None, new_tier=novo_item.tier
        )
    )
    db.commit()
    return novo_item


@app.put("/items/{item_id}", response_model=schemas.Item)
def atualizar_tier(
    item_id: int,
    dados: schemas.ItemUpdateTier,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if dados.tier not in VALID_TIERS:
        raise HTTPException(status_code=422, detail="Tier inválido")
    item = _get_owned_item(item_id, user_id, db)
    if item.tier != dados.tier:
        db.add(
            models.TierHistory(
                item_id=item.id, old_tier=item.tier, new_tier=dados.tier
            )
        )
        item.tier = dados.tier
        db.commit()
        db.refresh(item)
    return item


@app.delete("/items/{item_id}", status_code=204)
def deletar_item(
    item_id: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    item = _get_owned_item(item_id, user_id, db)
    db.delete(item)
    db.commit()


@app.get("/items/{item_id}/history", response_model=list[schemas.TierHistoryOut])
def historico_item(
    item_id: int,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    item = _get_owned_item(item_id, user_id, db)
    return (
        db.query(models.TierHistory)
        .filter(models.TierHistory.item_id == item.id)
        .order_by(models.TierHistory.changed_at)
        .all()
    )
