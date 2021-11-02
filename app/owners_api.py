import logging
from flask import Blueprint, jsonify, request
from app.db.models import Branch, Order, OrderStatuses, OperationModes
from app.db.management import db_session

bp = Blueprint('owners_api', __name__, url_prefix='/owners')
logger = logging.getLogger()

# Para testear que funcione el ruteo desde el dueño
@bp.route('/api-info')
def clients_api_info():
    return jsonify(name='Api para los duenios de restaurantes')

# Actualiza la url del menu de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/update_menu?branch_id=3&menu_url=http://prueba.com/menusito.pdf
@bp.route('/update_menu')
def update_menu():
    branch_id = request.args['branch_id']
    branch_menu_url = request.args['menu_url']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.menu_url = branch_menu_url

    db_session.commit()

    return jsonify({'resultado': "El menu ha sido actualizado.", 'menu_url': branch.menu_url})

# Crea una sucursal de restaurante para el dueño
# Ejemplo url: http://127.0.0.1:5000/owners/create_a_branch?name=ArquiWebers1&latitude=2.222&longitude=3.333&number_of_tables=4&email=5@test.com.ar&phone_number=66666666&logo_url=http://prueba.com/logo7.pdf&menu_url=http://prueba.com/menu8.pdf&mode=IN_PLACE&owner_id=2
@bp.route('/create_a_branch')
def create_a_branch():
    branch_name = request.args['name']
    branch_latitude = request.args['latitude']
    branch_longitude = request.args['longitude']
    branch_number_of_tables = request.args['number_of_tables']
    branch_email = request.args['email']
    branch_phone_number = request.args['phone_number']
    branch_logo_url = request.args['logo_url']
    branch_menu_url = request.args['menu_url']
    branch_mode = request.args['mode']
    branch_owner_id = request.args['owner_id']
    
    branch: Branch = Branch(
        name=branch_name,
        latitude=branch_latitude,
        longitude=branch_longitude,
        number_of_tables=branch_number_of_tables,
        email=branch_email,
        phone_number=branch_phone_number,
        logo_url=branch_logo_url,
        menu_url=branch_menu_url,
        mode=branch_mode,
        owner_id=branch_owner_id
    )

    db_session.add(branch)
    db_session.commit()

    return jsonify({'resultado': "La sucursal ha sido creada.", 'branch_id': branch.id})


# Acepta una orden recibida
# Ejemplo url: http://127.0.0.1:5000/owners/acept_order?order_id=1
@bp.route('/acept_order')
def acept_order():
    order_id = request.args['order_id']
    order: Order = Order.query.filter(Order.id == order_id).one()

    if order.status_id == OrderStatuses.PENDING:
        order.status_id = OrderStatuses.ACCEPTED
        db_session.commit()
    else:
        return jsonify({'error': "La orden debe estar pendiente."})

    return jsonify({'resultado': "La orden fue aceptada.", 'order_status': OrderStatuses(order.status_id).name})

# Rechaza una orden recibida
# Ejemplo url: http://127.0.0.1:5000/owners/reject_order?order_id=1
@bp.route('/reject_order')
def reject_order():
    order_id = request.args['order_id']
    order: Order = Order.query.filter(Order.id == order_id).one()

    if order.status_id == OrderStatuses.PENDING:
        order.status_id = OrderStatuses.REJECTED
        db_session.commit()
    else:
        return jsonify({'error': "La orden debe estar pendiente."})

    return jsonify({'resultado': "La orden fue rechazada.", 'order_status': OrderStatuses(order.status_id).name})

# Pone en proceso una orden ya aceptada
# Ejemplo url: http://127.0.0.1:5000/owners/start_making_order?order_id=1
@bp.route('/start_making_order')
def start_making_order():
    order_id = request.args['order_id']
    order: Order = Order.query.filter(Order.id == order_id).one()

    if order.status_id == OrderStatuses.ACCEPTED:
        order.status_id = OrderStatuses.IN_PROCESS
        db_session.commit()
    else:
        return jsonify({'error': "La orden debe ser aceptada previamente."})

    return jsonify({'resultado': "La orden fue puesta en proceso.", 'order_status': OrderStatuses(order.status_id).name})

# Finaliza una orden en proceso, dejandola lista para ser retirada o servida
# Ejemplo url: http://127.0.0.1:5000/owners/finalize_order?order_id=1
@bp.route('/finalize_order')
def finalize_order():
    order_id = request.args['order_id']
    order: Order = Order.query.filter(Order.id == order_id).one()

    if order.status_id == OrderStatuses.IN_PROCESS:
        order.status_id = OrderStatuses.READY
        db_session.commit()
    else:
        return jsonify({'error': "La orden debe estar en proceso para poder ser finalizada."})

    return jsonify({'resultado': "La orden ha sido marcada como finalizada y lista para ser retirada o servida.", 'status_status': OrderStatuses(order.status_id).name})

# Actualiza la url del logo de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/update_logo?branch_id=3&logo_url=http://prueba.com/loguito.jpg
@bp.route('/update_logo')
def update_logo():
    branch_id = request.args['branch_id']
    branch_logo_url = request.args['logo_url']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.logo_url = branch_logo_url

    db_session.commit()

    return jsonify({'resultado': "El logo ha sido actualizado.", 'logo_url': branch.logo_url})

# Actualiza el teléfono de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/update_phone?branch_id=3&phone_number=11111111
@bp.route('/update_phone')
def update_phone():
    branch_id = request.args['branch_id']
    branch_phone_number = request.args['phone_number']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.phone_number = branch_phone_number

    db_session.commit()

    return jsonify({'resultado': "El teléfono ha sido actualizado.", 'phone_number': branch.phone_number})

# Actualiza el email de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/update_mail?branch_id=3&email=111@testito.com
@bp.route('/update_mail')
def update_mail():
    branch_id = request.args['branch_id']
    branch_email = request.args['email']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.email = branch_email

    db_session.commit()

    return jsonify({'resultado': "El email ha sido actualizado.", 'email': branch.email})

# Cambia el modo de entrega de ordenes de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/change_mode?branch_id=3&mode=IN_PLACE
@bp.route('/change_mode')
def change_mode():
    branch_id = request.args['branch_id']
    branch_mode = request.args['mode']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.mode = branch_mode

    db_session.commit()

    return jsonify({'resultado': "El modo ha sido actualizado.", 'branch_mode': OperationModes(branch.mode).name})

# Actualiza el número de mesas de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/update_number_of_tables?branch_id=3&number_of_tables=11
@bp.route('/update_number_of_tables')
def update_number_of_tables():
    branch_id = request.args['branch_id']
    branch_number_of_tables = request.args['number_of_tables']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.number_of_tables = branch_number_of_tables

    db_session.commit()

    return jsonify({'resultado': "La cantidad de mesas ha sido actualizada.", 'number_of_tables': branch.number_of_tables})

# Corrige la ubicación de la sucursal en cuestión
# Ejemplo url: http://127.0.0.1:5000/owners/amend_location?branch_id=3&latitude=11.11&longitude=22.22
@bp.route('/amend_location')
def amend_location():
    branch_id = request.args['branch_id']
    branch_latitude = request.args['latitude']
    branch_longitude = request.args['longitude']

    branch: Branch = Branch.query.filter(Branch.id == branch_id).one()
    branch.latitude = branch_latitude
    branch.longitude = branch_longitude

    db_session.commit()

    return jsonify({'resultado': "La ubicación ha sido corregida.", 'latitude': branch.latitude,
                    'longitude': branch.longitude})

#Devuelve la lista de las ordenes activas
# Ejemplo url: http://127.0.0.1:5000/owners/active_orders?branch_id=1
@bp.route('/active_orders')
def active_orders():
    branch_id = request.args['branch_id']

    orders_list = Order.query.filter(Order.branch_id == branch_id, Order.status_id != OrderStatuses.REJECTED,
                                     Order.status_id != OrderStatuses.READY)
    orders_response = []
    for o in orders_list:
        an_order: Order = o
        orders_response.append({
            'order_id': an_order.id,
            'table_number': an_order.table_number,
            'timestamp': an_order.timestamp,
            'content': an_order.content,
            'status': OrderStatuses(an_order.status_id).name
        })

    return jsonify(orders_response)

#Devuelve la lista de las ordenes historicas de la sucursal
# Ejemplo url: http://127.0.0.1:5000/owners/historical_orders?branch_id=1
@bp.route('/historical_orders')
def historical_orders():
    branch_id = request.args['branch_id']

    orders_list = Order.query.filter(Order.branch_id == branch_id)
    orders_response = []
    for o in orders_list:
        an_order: Order = o
        orders_response.append({
            'order_id': an_order.id,
            'table_number': an_order.table_number,
            'timestamp': an_order.timestamp,
            'content': an_order.content,
            'status': OrderStatuses(an_order.status_id).name
        })

    return jsonify(orders_response)
