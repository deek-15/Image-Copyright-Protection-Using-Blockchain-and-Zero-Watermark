# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN pip install opencv-python-headless
RUN pip install numpy
RUN pip install scipy
RUN pip install pywavelets
RUN pip install flask-cors

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]