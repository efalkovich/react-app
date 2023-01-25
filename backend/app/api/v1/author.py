from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.v1.lang import add_lang
from app.db import get_db
from app.models.author import AuthorModel, Author

router = APIRouter()

@router.get("/authors", response_model=list[AuthorModel])
def get_authors(name: str | None = None, session: Session = Depends(get_db)):

    query = session.query(Author)
    if name is not None:
        query = query.filter(Author.name.contains(name))

    return query.all()

@router.get("/authors/{author_id}", response_model=AuthorModel)
def get_author(author_id: int, session: Session = Depends(get_db)):
    db_author = session.query(Author).filter(Author.id == author_id).one_or_none()
    if db_author is None:
        raise HTTPException(status_code=404)
    else:
        return db_author

@router.post("/authors", response_model=AuthorModel)
def add_author(author: AuthorModel, session: Session = Depends(get_db)):
    db_author = session.query(Author).filter(Author.id == author.id).one_or_none()
    if db_author is not None:
        return db_author

    db_author = Author(
        name=author.name,
        bday=author.bday,
        bio=author.bio,
    )

    for lang in author.langs:
        db_lang = add_lang(lang, session)
        db_author.langs.append(db_lang)

    session.add(db_author)
    session.commit()
    session.refresh(db_author)

    return db_author

@router.put("/authors/{author_id}", response_model=AuthorModel)
def change_author(author: AuthorModel, author_id: int, session: Session = Depends(get_db)):
    db_author = session.query(Author).filter(Author.id == author_id).one_or_none()
    if db_author is None:
        raise HTTPException(status_code=404)
    if author.name is not None:
        db_author.name = author.name
    if author.bday is not None:
        db_author.bday = author.bday
    if author.bio is not None:
        db_author.bio = author.bio
    if author.langs is not None:
        new_langs = []
        for lang in author.langs:
            db_lang = add_lang(lang, session)
            new_langs.append(db_lang)
        db_author.langs = new_langs

    session.commit()
    return db_author

@router.delete("/authors/{author_id}", response_model=None)
def delete_author(author_id: int, session: Session = Depends(get_db)):
    db_author = session.query(Author).filter(Author.id == author_id).one()
    if db_author is None:
        raise HTTPException(status_code=404)

    session.delete(db_author)
    session.commit()

    return
