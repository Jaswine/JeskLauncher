FROM python:3.10

RUN mkdir jesk
WORKDIR jesk

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ADD . /jesk/

ENV APP_NAME=JESK

COPY . .
CMD gunicorn demo.wsgi:application -b 0.0.0.0:8080