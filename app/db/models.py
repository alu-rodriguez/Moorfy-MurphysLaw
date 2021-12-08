import dataclasses
import enum
from typing import Optional
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import declarative_base

from app.db.management import db_session

Base = declarative_base()
Base.query = db_session.query_property()


class Menu(Base):
    __tablename__ = 'Menu'

    id: int = Column('Id', Integer, primary_key=True, autoincrement=True)
    url: str = Column('Url', String, nullable=False)


class Photo(Base):
    __tablename__ = 'Photo'

    id: int = Column('Id', Integer, primary_key=True, autoincrement=True)
    url: str = Column('Url', String, nullable=False)


@dataclasses.dataclass(init=False)
class User(Base):
    __tablename__ = 'User'

    id: int = Column('Id', Integer, primary_key=True, autoincrement=True)
    first_name: str = Column('FirstName', String, nullable=False)
    last_name: str = Column('LastName', String, nullable=False)
    password: str = Column('Password', String, nullable=False)
    email: str = Column('Email', String, nullable=False)
    is_admin: int = Column('IsAdmin', Integer)

    def jsonify(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password': self.password,
            'email': self.email,
            'is_admin': self.is_admin
        }


class OperationModes(enum.IntEnum):
    PICK_UP = 0
    IN_PLACE = 1


class Branch(Base):
    __tablename__ = 'Branch'

    id: int = Column('Id', Integer, primary_key=True, autoincrement=True)
    name: str = Column('Name', String, nullable=False)
    latitude: float = Column('Latitude', Float, nullable=False)
    longitude: float = Column('Longitude', Float, nullable=False)
    #menu_id: int = Column('MenuId', Integer, ForeignKey(Menu.id))
    number_of_tables: int = Column('NumberOfTables', Integer, nullable=False)
    email: str = Column('Email', String, nullable=False)
    phone_number: int = Column('PhoneNumber', Integer, nullable=False)
    logo_url: str = Column('LogoUrl', String, nullable=False)
    menu_url: str = Column('MenuUrl', String, nullable=False)
    mode: str = Column('Mode', Enum(OperationModes), nullable=False)
    owner_id: int = Column('OwnerId', Integer, nullable=False)
    app_id: int = Column('AppId', Integer, nullable=False)

    def jsonify(self):
        return {
            'branch_id': self.id,
            'name': self.name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'number_of_tables': self.number_of_tables,
            'email': self.email,
            'phone_number': self.phone_number,
            'logo_url': self.logo_url,
            'menu_url': self.menu_url,
            'mode': OperationModes(self.mode).name,
            'owner_id': self.owner_id,
            'appId': self.app_id
        }


class OrderStatuses(enum.IntEnum):
    PENDING = 1
    ACCEPTED = 2
    REJECTED = 3
    IN_PROCESS = 4
    READY = 5


class OrderStatus(Base):
    __tablename__ = 'OrderStatus'

    id: int = Column('Id', Integer, primary_key=True, autoincrement=True)
    description: str = Column('Description', Enum(OrderStatuses), unique=True, nullable=False)


class Order(Base):
    __tablename__ = 'Order'

    id: int = Column('Id', Integer, primary_key=True, autoincrement=True)
    branch_id: int = Column('BranchId', Integer, ForeignKey(Branch.id))
    user_id: int = Column('UserId', Integer, ForeignKey(User.id))
    status_id: int = Column('StatusId', Integer, ForeignKey(OrderStatus.id))
    content: str = Column('Content', String, nullable=False)
    table_number: int = Column('TableNumber', Integer, nullable=False)
    timestamp: Optional[datetime] = Column('Timestamp', DateTime)

    def jsonify(self):
        return {
            'order_id': self.id,
            'branch_id': self.branch_id,
            'user_id': self.branch_id,
            'status': OrderStatuses(self.status_id).name,
            'content': self.content,
            'table_number': self.table_number,
            'timestamp': self.timestamp
        }
