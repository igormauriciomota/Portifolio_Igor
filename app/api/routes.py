from collections import Counter

from flask import jsonify

from . import api_bp
from ..models import Project


@api_bp.get("/portfolio/stats")
def portfolio_stats():
    projects = Project.query.filter_by(published=True).all()
    categories = Counter(p.category for p in projects)
    return jsonify({"projects": len(projects), "categories": categories, "technologies": len({t for p in projects for t in p.technology_list})})

