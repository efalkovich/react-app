from datetime import date

from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date
from sqlalchemy.schema import Table
from sqlalchemy.orm import relationship

from app.db import Base

from pydantic import BaseModel

from app.models.lang import LangModel

author_lang_table = Table(
    'author_language_join', Base.metadata,
    Column("author_id", ForeignKey("author.id"), primary_key=True),
    Column("lang_name", ForeignKey("lang.name"), primary_key=True)
)


class Author(Base):
    __tablename__ = 'author'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(127), nullable=False)
    bday = Column(Date, nullable=False)
    bio = Column(Text, nullable=False)

    langs = relationship("Lang", secondary=author_lang_table)


class AuthorModel(BaseModel):
    id: int | None
    name: str | None
    bday: date | None
    bio: str | None

    langs: list[LangModel]

    class Config:
        orm_mode = True