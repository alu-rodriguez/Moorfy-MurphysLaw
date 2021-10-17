import sqlite3

import click
from flask import current_app, g, Flask
from flask.cli import with_appcontext
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


engine = create_engine('sqlite:///instance/tp.sqlite', echo=True, future=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

        return g.db


def close_db(exception=None):
    db = g.pop('db', None)
    if db:
        db.close()


def shutdown_session(exception=None):
    db_session.remove()


def execute_db_script(name: str):
    db = get_db()
    with current_app.open_resource(f'db/scripts/{name}') as file:
        db.executescript(file.read().decode('utf8'))


@click.command('init-db')
@with_appcontext
def init_db_command():
    execute_db_script('create_schema.sql')
    click.echo('Initialized the db')


@click.command('populate-db')
@with_appcontext
def populate_db_command():
    execute_db_script('insert_test_data.sql')
    click.echo('Populated the db with test data')


def init_app(app: Flask):
    app.teardown_appcontext(close_db)
    app.teardown_appcontext(shutdown_session)
    app.cli.add_command(init_db_command)
    app.cli.add_command(populate_db_command)
