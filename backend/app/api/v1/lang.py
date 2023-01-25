from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.lang import LangModel, Lang
from typing import List

router = APIRouter()

@router.get("/langs", response_model=list[LangModel])
def get_langs(session: Session = Depends(get_db)):
    return session.query(Lang).all()

@router.get("/langs/{name}", response_model=LangModel)
def get_lang(name: str, session: Session = Depends(get_db)):

    lang = session.query(Lang).filter(Lang.name == name).one_or_none()

    if lang is None:
        raise HTTPException(status_code=404)
    else:
        return lang

@router.post("/langs", response_model=LangModel)
def add_lang(lang: LangModel, session: Session = Depends(get_db)):

    db_lang = session.query(Lang).filter(Lang.name == lang.name).one_or_none()
    if db_lang is not None:
        return db_lang

    db_lang = Lang(
        name=lang.name,
        full_name=lang.full_name
    )

    session.add(db_lang)
    session.commit()
    return db_lang

@router.put("/langs/{name}", response_model=LangModel)
def change_lang(lang: LangModel, name: str, session: Session = Depends(get_db)):
    db_lang = session.query(Lang).filter(Lang.name == name).one_or_none()

    if db_lang is None:
        raise HTTPException(status_code=404)

    if lang.full_name is not None:
        db_lang.full_name = lang.full_name

    session.commit()

    return db_lang

@router.delete("/langs/{name}", response_model=None)
def delete_lang(name: str, session: Session = Depends(get_db)):

    db_lang = session.query(Lang).filter(Lang.name == name).one()
    if db_lang is None:
        raise HTTPException(status_code=404)

    session.delete(db_lang)
    session.commit()

    return
