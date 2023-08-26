# Use a suitable base image
FROM ubuntu:latest

# Update the package list and install packages
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    gdal-bin \
    libgdal-dev

# Install Python packages using pip
RUN pip3 install numpy pandas  # Add more packages as needed

# Set the GDAL library path
ENV GDAL_LIBRARY_PATH /usr/lib/libgdal.so

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["gunicorn" "portfolio_core.wsgi"]