FROM python:alpine

RUN apk update

WORKDIR /app/backend

COPY requirement.txt requirement.txt

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install psycopg2
RUN apk add --no-cache postgresql-libs
RUN apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev
RUN python3 -m pip install -r requirement.txt

COPY . .