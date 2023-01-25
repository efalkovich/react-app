from fastapi import APIRouter
import app.api.v1.lang
import app.api.v1.book
import app.api.v1.author

router = APIRouter()

router.include_router(lang.router)
router.include_router(book.router)
router.include_router(author.router)

