import enum
from datetime import date

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date, Enum
from sqlalchemy.schema import Table
from sqlalchemy.orm import relationship

from app.db import Base

from pydantic import BaseModel, validator

from app.models.author import AuthorModel
from app.models.lang import LangModel

book_author_table = Table(
    'book_author_join', Base.metadata,
    Column("book_id", ForeignKey("book.id"), primary_key=True),
    Column("author_id", ForeignKey("author.id"), primary_key=True)
)


class BookStatus(str, enum.Enum):
    READ = 'read'
    PLANNED = 'planned'


class Book(Base):
    __tablename__ = 'book'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    year_publication = Column(Integer, nullable=False)
    status = Column(Enum(BookStatus))

    authors = relationship("Author", secondary=book_author_table)

    lang_name = Column(ForeignKey("lang.name"))
    lang = relationship("Lang", lazy='selectin')


class BookModel(BaseModel):
    id: int | None
    name: str | None
    year_publication: int | None
    status: BookStatus

    lang: LangModel | None
    authors: list[AuthorModel]

    @validator("year_publication")
    def check_year(cls, v):
        if v > date.today().year+1:
            raise ValueError(f"Year more {date.today().year+1}")
        elif v < 0:
            raise ValueError(f"Year can't be less them zero")
        else:
            return v


    class Config:
        orm_mode = True
        use_enum_values = True