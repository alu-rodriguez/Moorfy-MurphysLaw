from flask import Blueprint, current_app

from app.db.models import Menu


bp = Blueprint('health', __name__, url_prefix='/health-check')


@bp.route('/0')
def shallow_check():
    return 'I\'m alive!'


@bp.route('/1')
def deep_check():
    try:
        Menu.query.limit(1).all()
        return 'Everything seems fine'
    except Exception as e:
        current_app.logger(e)
        return 'Something\'s not working'
