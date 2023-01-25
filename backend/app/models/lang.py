from sqlalchemy import Column, Integer, String

from app.db import Base

from pydantic import BaseModel, validator


class Lang(Base):
    __tablename__ = 'lang'

    name = Column(String(2), primary_key=True, nullable=False)
    full_name = Column(String(255))


class LangModel(BaseModel):
    name: str | None
    full_name: str | None

    @validator("name")
    def check_lang(cls, v):
        if len(v) != 2:
            raise ValueError("Length of language must be equal 2")
        else:
            return v

    class Config:
        orm_mode = True
