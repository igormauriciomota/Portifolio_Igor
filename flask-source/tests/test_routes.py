def test_home_returns_success(client):
    """A página pública deve responder e conter a proposta principal."""
    response = client.get("/")
    assert response.status_code == 200
    assert "dados em decisões" in response.get_data(as_text=True)


def test_admin_redirects_anonymous_user(client):
    """Uma pessoa sem sessão não pode abrir o painel."""
    response = client.get("/admin/", follow_redirects=False)
    assert response.status_code == 302
    assert "/auth/login" in response.headers["Location"]


def test_professional_avatar_is_included(client):
    """O pacote completo deve entregar a foto usada como avatar do Flask."""

    response = client.get("/portfolio-assets/igor-avatar-realistic-v2.webp")
    assert response.status_code == 200
    assert response.mimetype == "image/webp"
