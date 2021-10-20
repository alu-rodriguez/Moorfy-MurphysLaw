import logging
from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.orm import session

from app.db.models import Branch, Menu, Order, OrderStatuses
from app.db.management import db_session

bp = Blueprint('clients_api', __name__, url_prefix='/clients')
logger = logging.getLogger()

# Para testear que funcione el ruteo desde el cliente
@bp.route('/api-info')
def clients_api_info():
    return jsonify(name='Api para los clientes de restaurantes')

#Prueben esto si les levanta la base, por favor
@bp.route('/branches')
def branches_list():
    return jsonify(Branch.query.all())

#Prueben esto si les levanta la base, por favor
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

#Prueben esto si les levanta la base, por favor
@bp.route('/ask_for_menu')
def ask_for_menu():
    branch_menu_id = request.args['branch_id']
    branch: Branch = session.query(Branch).filter(Branch.id == branch_menu_id).one()
    menu: Menu = session.query(Menu).filter(Menu.id == branch.menu_id).one()

    return jsonify(menu)
