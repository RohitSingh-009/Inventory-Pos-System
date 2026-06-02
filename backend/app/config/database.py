from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# MYSQL DATABASE URL
DATABASE_URL = "mysql+pymysql://root:Rohit%402005@localhost/grocery_pos"

# DATABASE ENGINE
engine = create_engine(DATABASE_URL)

# SESSION
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# BASE CLASS
Base = declarative_base()