FROM python:3.10

ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt ${APP_HOME}
# install python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . ${APP_HOME}

# running migrations
RUN python manage.py migrate

# gunicorn
# CMD ["gunicorn", "--config", "gunicorn-cfg.py", "config.wsgi"]
CMD ["python", "manage.py", "runserver", "127.0.0.1:8000"]
