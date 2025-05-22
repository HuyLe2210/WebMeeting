import os
from flask_sqlalchemy import SQLAlchemy

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:''@localhost/examapp' # Hoặc MySQL/PostgreSQL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

db = SQLAlchemy()
