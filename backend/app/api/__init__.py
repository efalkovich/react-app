from fastapi import APIRouter
from app.api.v1 import router

routerApi = APIRouter()

routerApi.include_router(router, prefix="/v1")
