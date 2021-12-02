import logging
from http import HTTPStatus


from flask import Blueprint, jsonify, make_response, current_app, request
from sqlalchemy.exc import NoResultFound

from app.db.models import User, Branch
from app.db.management import db_session

bp = Blueprint('api', __name__, url_prefix='/api')
logger = logging.getLogger()


# Para testear que funcione el ruteo desde el cliente
@bp.route('/app-info')
def app_info():
    return jsonify(name='ArquiWeb - TP 1')


# Solo como ejemplo para probar como insertar
@bp.route('/user', methods=['POST'])
def create_user():
    # TODO: validar la estructura del mensaje
    body = request.json
    user = User(
        id=None,
        first_name=body['firstName'],
        last_name=body['lastName'],
        password=body['password'],
        email=body['email'],
        is_admin=None
    )
    db_session.add(user)
    db_session.commit()
    return make_response(
        'User creation successful',
        HTTPStatus.CREATED
    )

# Devuelve el usuario seleccionado
# URL ejemplo: http://127.0.0.1:5000/api/user/1
@bp.route('/user/<int:user_id>')
def get_user(user_id: int):
    try:
        return jsonify(User.query.filter(User.id == user_id).one())
    except NoResultFound:
        return make_response('User not found', HTTPStatus.NOT_FOUND)
    except Exception as e:
        current_app.logger.error(f'Failed to retrieve user with id {user_id}. Exception {e}')
        return make_response('Couldn\'t retrieve user info, please try again later', HTTPStatus.INTERNAL_SERVER_ERROR)

#Devuelve la sucursal según el id del parámetro
# URL ejemplo: http://127.0.0.1:5000/api/obtain_a_branch?branch_id=1
@bp.route('/obtain_a_branch')
def obtain_a_branch():
    branch_id= request.args['branch_id']
    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    Branch.jsonify(branch)

    return Branch.jsonify(branch)


#Devuelve la lista de las usuarios registrados
# URL ejemplo: http://127.0.0.1:5000/api/usuarios
@bp.route('/usuarios')
def users_list():
    user_list = User.query.all()
    users_response = []
    for u in user_list:
        users_response.append(User.jsonify(u))

    return jsonify(users_response)
