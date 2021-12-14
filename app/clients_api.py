import logging

from datetime import datetime

from flask import Blueprint, jsonify, request, json
from app.db.models import Branch, Order, OrderStatuses
from app.db.management import db_session

bp = Blueprint('clients_api', __name__, url_prefix='/clients')
logger = logging.getLogger()

# Para testear que funcione el ruteo desde el cliente
@bp.route('/api-info', methods=['GET'])
def clients_api_info():
    return jsonify(name='Api para los clientes de restaurantes')

#Devuelve la lista de las sucursales registradas
# URL ejemplo: http://127.0.0.1:5000/clients/branches
@bp.route('/branches', methods=['GET'])
def branches_list():
    branch_list = Branch.query.all()
    branches_response = []
    for b in branch_list:
        branches_response.append(Branch.jsonify(b))

    return jsonify(branches_response)

# Genera la orden en la base
# URL ejemplo: http://127.0.0.1:5000/clients/place_an_order?branch_id=1&table_id=2&user_id=3&order_content=Pido%20la%20promo%204
@bp.route('/place_an_order', methods=['GET']) #methods=['POST'])
def place_an_order():
    branch_id= request.args['branch_id']
    table_id= request.args['table_id']
    user_id= request.args['user_id']
    order_content= request.args['order_content']

    order = Order(
        branch_id= branch_id,
        user_id= user_id,
        status_id= OrderStatuses.PENDING,
        table_number= table_id,
        content= order_content,
        timestamp= datetime.now()
    )

    db_session.add(order)
    db_session.commit()

    return jsonify({'resultado': "Su Orden ha sido enviada.", 'orden id': order.id})

# Devuelve la url del menu de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/clients/ask_for_menu?branch_id=2
@bp.route('/ask_for_menu', methods=['GET'])
def ask_for_menu():
    branch_menu_id = request.args['branch_id']
    branch: Branch = Branch.query.filter(Branch.id == branch_menu_id).one()

    return jsonify({'menu_url': branch.menu_url})

# Genera la orden en la base
# URL ejemplo: http://127.0.0.1:5000/clients/ask_status_of_order?branch_id=1&table_id=2&user_id=3
@bp.route('/ask_status_of_order', methods=['GET'])
def ask_status_of_order():
    branch_id= request.args['branch_id']
    table_id= request.args['table_id']
    user_id= request.args['user_id']

    order: Order = Order.query.filter(Order.branch_id == branch_id, Order.table_number == table_id, Order.user_id == user_id).one()
    order_status: OrderStatuses = OrderStatuses(order.status_id)

    return jsonify({'order_status_id': order_status.name})

# Llama al servicio de mesa
# URL ejemplo: http://127.0.0.1:5000/clients/ask_for_server?branch_id=1&table_id=2
@bp.route('/ask_for_server', methods=['GET']) #methods=['PUT'])
def ask_for_server():
    branch_id= request.args['branch_id']
    table_id= request.args['table_id']

    return jsonify({'resultado': 'Se ha realizado el llamado al servicio de mesa.'})
