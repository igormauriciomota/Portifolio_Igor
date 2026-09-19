from flask_wtf import FlaskForm
from wtforms import BooleanField, IntegerField, PasswordField, SelectField, StringField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, NumberRange, Optional, URL


class ContactForm(FlaskForm):
    name = StringField("Nome", validators=[DataRequired(), Length(max=120)])
    email = StringField("E-mail", validators=[DataRequired(), Email(), Length(max=180)])
    subject = StringField("Assunto", validators=[DataRequired(), Length(max=160)])
    message = TextAreaField("Mensagem", validators=[DataRequired(), Length(min=10, max=3000)])
    consent = BooleanField("Concordo com o uso dos dados para retorno do contato.", validators=[DataRequired()])


class LoginForm(FlaskForm):
    username = StringField("Usuário", validators=[DataRequired(), Length(max=80)])
    password = PasswordField("Senha", validators=[DataRequired(), Length(max=128)])
    remember = BooleanField("Manter conectado")


class ProjectForm(FlaskForm):
    title = StringField("Título", validators=[DataRequired(), Length(max=120)])
    slug = StringField("Slug da URL", validators=[DataRequired(), Length(max=140)])
    summary = TextAreaField("Resumo", validators=[DataRequired(), Length(max=280)])
    description = TextAreaField("Descrição", validators=[DataRequired(), Length(min=20, max=8000)])
    technologies = StringField("Tecnologias", validators=[DataRequired(), Length(max=300)])
    category = SelectField("Categoria", choices=[("Web", "Web"), ("Dados", "Dados"), ("Automação", "Automação"), ("API", "API"), ("ERP", "ERP")])
    level = SelectField("Nível", choices=[("Fundamentos", "Fundamentos"), ("Intermediário", "Intermediário"), ("Avançado", "Avançado"), ("Profissional", "Profissional")])
    status = SelectField("Status", choices=[("Concluído", "Concluído"), ("Em evolução", "Em evolução"), ("Planejado", "Planejado")])
    year = IntegerField("Ano", validators=[DataRequired(), NumberRange(min=2020, max=2100)])
    repo_url = StringField("GitHub", validators=[Optional(), URL(), Length(max=300)])
    demo_url = StringField("Demonstração", validators=[Optional(), URL(), Length(max=300)])
    image_url = StringField("Imagem (URL)", validators=[Optional(), URL(), Length(max=300)])
    featured = BooleanField("Destacar na página inicial")
    published = BooleanField("Visível ao público")
