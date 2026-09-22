from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect


# As extensões são criadas sem a aplicação para evitar importações circulares.
db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()

login_manager.login_view = "auth.login"
login_manager.login_message = "Entre com sua conta administrativa."
login_manager.login_message_category = "warning"
