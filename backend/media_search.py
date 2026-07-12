import os

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

load_dotenv()

router = APIRouter()

ITUNES_URL = "https://itunes.apple.com/search"
TMDB_URL = "https://api.themoviedb.org/3"
TMDB_API_KEY = os.environ["TMDB_API_KEY"]
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300"


def _buscar_albuns(query: str) -> list[dict]:
    params = {"term": query, "media": "music", "entity": "album", "limit": 8}
    try:
        resposta = httpx.get(ITUNES_URL, params=params, timeout=5)
        resposta.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Não foi possível buscar na iTunes API")

    resultados = []
    for item in resposta.json().get("results", []):
        artwork = item.get("artworkUrl100")
        resultados.append(
            {
                "id": item.get("collectionId"),
                "title": item.get("collectionName"),
                "creator": item.get("artistName"),
                "year": (item.get("releaseDate") or "")[:4],
                "artwork_url": artwork.replace("100x100bb", "400x400bb") if artwork else None,
            }
        )
    return resultados


def _buscar_filmes(query: str) -> list[dict]:
    params = {"api_key": TMDB_API_KEY, "query": query, "language": "pt-BR"}
    try:
        resposta = httpx.get(f"{TMDB_URL}/search/movie", params=params, timeout=5)
        resposta.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Não foi possível buscar no TMDb")

    resultados = []
    for item in resposta.json().get("results", [])[:8]:
        poster = item.get("poster_path")
        resultados.append(
            {
                "id": item.get("id"),
                "title": item.get("title"),
                "creator": None,
                "year": (item.get("release_date") or "")[:4],
                "artwork_url": f"{TMDB_IMAGE_BASE}{poster}" if poster else None,
            }
        )
    return resultados


@router.get("/media-search")
def buscar_midia(query: str = Query(..., min_length=2), type: str = Query(...)):
    if type not in ("filme", "album"):
        raise HTTPException(status_code=422, detail="type deve ser 'filme' ou 'album'")
    return _buscar_filmes(query) if type == "filme" else _buscar_albuns(query)


@router.get("/media-search/movie-director/{movie_id}")
def buscar_diretor(movie_id: int):
    params = {"api_key": TMDB_API_KEY}
    try:
        resposta = httpx.get(f"{TMDB_URL}/movie/{movie_id}/credits", params=params, timeout=5)
        resposta.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Não foi possível buscar os créditos no TMDb")

    diretores = [c["name"] for c in resposta.json().get("crew", []) if c.get("job") == "Director"]
    return {"director": ", ".join(diretores) if diretores else None}
