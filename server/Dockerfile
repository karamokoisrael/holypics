FROM python:3.9.6
RUN mkdir /usr/src/app/
COPY . /usr/src/app/
WORKDIR /usr/src/app/
EXPOSE 81
RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
