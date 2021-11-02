import os

from flask import Flask, send_from_directory

from . import api, health, clients_api, owners_api
from app.db import management


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'tp.sqlite'),
    )

    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_pyfile('config.py', silent=True)

    db.management.init_app(app)

    app.register_blueprint(health.bp)
    app.register_blueprint(api.bp)
    app.register_blueprint(clients_api.bp)
    app.register_blueprint(owners_api.bp)

    @app.route('/<path:path>')
    def static_proxy(path):
        return send_from_directory('../public', path)

    @app.route('/')
    def index():
        return send_from_directory('../public', 'index.html')

    return app
