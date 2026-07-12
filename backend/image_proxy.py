from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response

router = APIRouter()


def _host_permitido(host: str | None) -> bool:
    if not host:
        return False
    return host == "image.tmdb.org" or host.endswith(".mzstatic.com")


@router.get("/image-proxy")
def proxiar_imagem(url: str = Query(...)):
    if not _host_permitido(urlparse(url).hostname):
        raise HTTPException(status_code=400, detail="Host de imagem não permitido")

    try:
        resposta = httpx.get(url, timeout=10)
        resposta.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Não foi possível buscar a imagem")

    return Response(
        content=resposta.content,
        media_type=resposta.headers.get("content-type", "image/jpeg"),
        headers={"Cache-Control": "public, max-age=86400"},
    )
