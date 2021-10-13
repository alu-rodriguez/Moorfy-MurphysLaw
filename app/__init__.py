from flask import Flask, send_from_directory, jsonify


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_pyfile('config.py', silent=True)

    # Para testear que funcione el ruteo desde el cliente
    @app.route('/api/app-info')
    def app_info():
        return jsonify(
            name='ArquiWeb - TP 1'
        )

    @app.route('/health-check')
    def health_check():
        return 'I\'m alive!'

    @app.route('/<path:path>', methods=['GET'])
    def static_proxy(path):
        return send_from_directory('../public', path)

    @app.route('/')
    def index():
        return send_from_directory('../public', 'index.html')

    return app
