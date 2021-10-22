import logging
from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.orm import session
from app.db.models import Branch, Order, OrderStatuses
from app.db.management import db_session

bp = Blueprint('clients_api', __name__, url_prefix='/clients')
logger = logging.getLogger()

# Para testear que funcione el ruteo desde el cliente
@bp.route('/api-info')
def clients_api_info():
    return jsonify(name='Api para los clientes de restaurantes')

#Devuelve la lista de las sucursales registradas
@bp.route('/branches')
def branches_list():
    branch_list = Branch.query.all()
    branches_response = []
    for b in branch_list:
        a_branch: Branch = b
        branches_response.append({
            'name': a_branch.name,
            'latitude': a_branch.latitude,
            'longitude': a_branch.longitude,
            'number_of_tables': a_branch.number_of_tables,
            'email': a_branch.email,
            'phone_number': a_branch.phone_number,
            'logo_url': a_branch.logo_url,
            'menu_url': a_branch.menu_url,
            'mode': a_branch.mode
        })

    return jsonify(branches_response)

# Genera la orden en la base
# URL ejemplo: http://127.0.0.1:5000/clients/place_an_order?branch_id=1&table_id=2&user_id=3&order_content=Pido%20la%20promo%204
@bp.route('/place_an_order')
def place_an_order():
    branch_id= request.args['branch_id']
    table_id= request.args['table_id']
    user_id= request.args['user_id']
    order_content= request.args['order_content']

    order = Order(
        branch_id= branch_id,
        user_id= user_id,
        status_id= OrderStatuses.PENDING,
        content= order_content,
        table_number= table_id,
        timestamp= datetime.now()
    )

    db_session.add(order)
    db_session.commit()

    return jsonify({'resultado': "Su Orden ha sido enviada.", 'orden id': order.id})

# Devuelve la url del menu de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/clients/ask_for_menu?branch_id=2
@bp.route('/ask_for_menu')
def ask_for_menu():
    branch_menu_id = request.args['branch_id']
    branch: Branch = Branch.query.filter(Branch.id == branch_menu_id).one()

    return jsonify({'menu_url': branch.menu_url})
