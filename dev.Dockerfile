# Use a suitable base image
FROM python:3.10-slim-bookworm AS builder

WORKDIR /app

# Update the package list and install packages
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    python3-gdal

ENV GDAL_LIBRARY_PATH /usr/lib/libgdal.so

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/
EXPOSE 8000
ENTRYPOINT ["python", "manage.py"]
CMD ["runserver", "0.0.0.0:8000"]
