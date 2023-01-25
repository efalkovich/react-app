from datetime import date
import fastapi.openapi.utils
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.openapi.models import Response
from sqlalchemy.orm import Session
from app.api.v1.author import add_author
from app.api.v1.lang import add_lang
from app.db import get_db
from app.models import *
from app.models.book import Book, BookModel, BookStatus

router = APIRouter()

@router.get("/book", response_model=list[BookModel])
def get_books(lang_name: str | None = None, status: BookStatus | None = None, author_id: int | None = None,
              name: str | None = None, year_publication: int | None = None, session: Session = Depends(get_db)):

    query = session.query(Book)

    if lang_name is not None:
        query = query.filter(Book.lang_name == lang_name)
    if status is not None and isinstance(status, BookStatus):
        query = query.filter(Book.status == status)
    if author_id is not None:
        query = query.filter(Book.authors.any(id=author_id))
    if year_publication is not None:
        query = query.filter(Book.year_publication == year_publication)
    if name is not None:
        query = query.filter(Book.name.contains(name))

    return query.all()

@router.get("/book/{book_id}", response_model=BookModel)
def get_book(book_id: int, session: Session = Depends(get_db)):

    book = session.query(Book).filter(Book.id == book_id).one_or_none()

    if book is None:
        raise HTTPException(status_code=404)
    else:
        return book

@router.post("/book", response_model=BookModel)
def add_book(book: BookModel, session: Session = Depends(get_db)):

    db_book = session.query(Book).filter(Book.id == book.id).one_or_none()
    if db_book is not None:
        return db_book

    db_book = Book(
        name=book.name,
        year_publication=book.year_publication,
        status=book.status
    )

    for author in book.authors:
        db_author = add_author(author, session)
        db_book.authors.append(db_author)

    db_lang = add_lang(book.lang, session)
    db_book.lang = db_lang

    session.add(db_book)
    session.commit()

    return db_book

@router.put("/book/{book_id}", response_model=BookModel)
def change_book(book: BookModel, book_id: int, session: Session = Depends(get_db)):

    db_book = session.query(Book).filter(Book.id == book_id).one_or_none()
    if db_book is None:
        raise HTTPException(status_code=404)

    if book.name is not None:
        db_book.name = book.name
    if book.year_publication is not None:
        db_book.year_publication = book.year_publication
    if book.status is not None:
        db_book.status = book.status

    if book.lang is not None:
        db_lang = add_lang(book.lang, session)
        db_book.lang = db_lang

    if book.authors is not None:
        db_book.authors.clear()
        for author in book.authors:
            db_author = add_author(author, session)
            db_book.authors.append(db_author)

    session.commit()
    return db_book

@router.delete("/book/{book_id}", response_model=None)
def delete_book(book_id: int, session: Session = Depends(get_db)):

    db_book = session.query(Book).filter(Book.id == book_id).one_or_none()
    if db_book is None:
        raise HTTPException(status_code=404)

    session.delete(db_book)
    session.commit()

    return None
