from flask import Blueprint, jsonify
from . import db


bp = Blueprint('api', __name__, url_prefix='/api')


# Para testear que funcione el ruteo desde el cliente
@bp.route('/app-info')
def app_info():
    return jsonify(
        name='ArquiWeb - TP 1'
    )


@bp.route('/menu')
def menu():
    items = db.get_db().execute("SELECT * FROM MenuItem")
    return jsonify([i['Name'] for i in items])
