# TP1_ArquiWeb
TP_ARQUIWEB

## Requisitos

Para correr la aplicación localmente es necesario:

* Node v14 o superior. Puede ser útil usar [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm), 
que ofrece la posibilidad de administrar múltiples versiones de Node.

* Python 3.8. Se sugiere trabajar con un entorno virtual para aislar las dependencias del proyecto de las instaladas
a nivel global en el sistema. Dos opciones posibles son: [venv](https://docs.python.org/3.8/library/venv.html),
que forma parte de la biblioteca estándar de Python, y [virtualenv](https://pypi.org/project/virtualenv/).
Para este último, existe un conjunto de extensiones llamado [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/)
que simplifica su uso.


## Correr el servidor localmente

El backend de la aplicación está escrito utilizando [Flask](https://flask.palletsprojects.com/en/2.0.x/).
Para ejecutarlo en modo desarrollo, puede ejecutarse
```bash
export FLASK_APP=app && export FLASK_ENV=development && flask run
```
```cmd
set FLASK_APP=app
set FLASK_ENV=development
flask run
```
```Power Shell
$env:FLASK_APP = "app"
$env:FLASK_ENV = "development"
python -m flask run
```
desde la raíz del proyecto.
Para correrlo en modo producción, reemplazar el valor de `FLASK_ENV` por `production`.

__Nota:__ si se usa *PyCharm Professional*, [esto puede ayudar](https://www.jetbrains.com/help/pycharm/run-debug-configuration-flask-server.html).


## Configurar la base de datos local

Se proveen los siguientes comandos, que deben ser ejecutados en la raíz del proyecto.

```bash
* `flask init-db` crea la base de datos.
* `flask populate-db` inserta un conjunto de datos de prueba.
```

```Power Shell
* `python -m flask init-db` crea la base de datos.
* `python -m flask populate-db` inserta un conjunto de datos de prueba.
```

Para producción:

export FLASK_APP=app && export FLASK_ENV=production


