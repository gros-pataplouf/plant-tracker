# Use a suitable base image
FROM --platform=$BUILDPLATFORM python:3.10-slim-bookworm AS builder

WORKDIR /app

# Update the package list and install packages
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    python3-gdal

ENV GDAL_LIBRARY_PATH /usr/lib/libgdal.so
ENV SECRET_KEY dummy_value_for_railway_setup_will_be_overwritten_as_soon_as_wsgi_takes_over

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/
EXPOSE 8000

ENTRYPOINT ["python"]
RUN python manage.py collectstatic --noinput --settings=core.settings.production

CMD ["gunicorn", "core.wsgi"]
