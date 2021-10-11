from flask import Blueprint
from . import db


bp = Blueprint('health', __name__, url_prefix='/health-check')


@bp.route('/0')
def shallow_check():
    return 'I\'m alive!'


@bp.route('/1')
def deep_check():
    try:
        db.get_db().execute('SELECT Id FROM MenuItem LIMIT 1')
        return 'Everything seems fine'
    except Exception:
        return 'Something\'s not working'
