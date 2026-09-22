from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from wtforms import BooleanField, IntegerField, SelectField, StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Email, Length, Optional, URL


class ProfileForm(FlaskForm):
    """Valida os dados pessoais antes de alterar a tabela Profile."""

    # DataRequired impede envio vazio; Length respeita o tamanho da coluna SQL.
    name = StringField("Nome", validators=[DataRequired(), Length(max=120)])
    headline = StringField("Título profissional", validators=[DataRequired(), Length(max=180)])
    location = StringField("Localização", validators=[DataRequired(), Length(max=120)])
    bio = TextAreaField("Sobre mim", validators=[DataRequired(), Length(max=2000)])

    # Optional permite campo vazio. Se houver valor, Email/URL validam o formato.
    email = StringField("E-mail", validators=[Optional(), Email(), Length(max=180)])
    linkedin_url = StringField("LinkedIn", validators=[Optional(), URL(), Length(max=500)])
    github_url = StringField("GitHub", validators=[Optional(), URL(), Length(max=500)])
    whatsapp_url = StringField("WhatsApp", validators=[Optional(), URL(), Length(max=500)])

    # FileAllowed bloqueia extensões que não pertencem à lista segura.
    photo = FileField(
        "Foto",
        validators=[FileAllowed(["jpg", "jpeg", "png", "webp"], "Envie JPG, PNG ou WebP.")],
    )
    resume = FileField("Currículo", validators=[FileAllowed(["pdf"], "Envie um PDF.")])
    submit = SubmitField("Salvar perfil")


class ProjectForm(FlaskForm):
    """Valida criação e edição de um card de projeto."""

    title = StringField("Título", validators=[DataRequired(), Length(max=160)])
    eyebrow = StringField("Categoria", validators=[DataRequired(), Length(max=100)])
    description = TextAreaField("Descrição", validators=[DataRequired(), Length(max=1800)])
    problem = TextAreaField("Problema observado", validators=[Optional(), Length(max=3000)])
    solution = TextAreaField("Solução proposta", validators=[Optional(), Length(max=3000)])
    highlights = TextAreaField("Destaques (um por linha)", validators=[Optional(), Length(max=3000)])
    integrations = TextAreaField("Integrações (uma por linha)", validators=[Optional(), Length(max=3000)])
    stack = StringField("Tecnologias", validators=[DataRequired(), Length(max=500)])
    status = SelectField(
        "Status",
        choices=[
            ("Em desenvolvimento", "Em desenvolvimento"),
            ("Em evolução", "Em evolução"),
            ("Publicado", "Publicado"),
            ("Planejado", "Planejado"),
        ],
    )
    accent = StringField("Cor", default="#ffd24a", validators=[DataRequired(), Length(max=20)])
    github_url = StringField("GitHub", validators=[Optional(), URL(), Length(max=500)])
    live_url = StringField("Demonstração", validators=[Optional(), URL(), Length(max=500)])
    video_url = StringField("Vídeo", validators=[Optional(), URL(), Length(max=500)])
    image = FileField(
        "Capa",
        validators=[FileAllowed(["jpg", "jpeg", "png", "webp"], "Envie JPG, PNG ou WebP.")],
    )
    video = FileField(
        "Vídeo curto",
        validators=[FileAllowed(["mp4", "webm"], "Envie MP4 ou WebM.")],
    )
    featured = BooleanField("Projeto em destaque", default=True)
    sort_order = IntegerField("Ordem", default=0)
    submit = SubmitField("Salvar projeto")


class ArticleForm(FlaskForm):
    """Gerencia textos publicados na seção de conteúdo."""

    title = StringField("Título", validators=[DataRequired(), Length(max=200)])
    summary = TextAreaField("Resumo", validators=[DataRequired(), Length(max=1000)])
    body = TextAreaField("Conteúdo", validators=[DataRequired(), Length(max=12000)])
    published = BooleanField("Publicar agora", default=False)
    submit = SubmitField("Salvar artigo")
