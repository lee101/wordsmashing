#!/usr/bin/env python

import os
import json
import urllib.parse

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.routing import Match
import logging

import fixtures
import blog
from ws import ws
from database import init_db
from static_version import STATIC_V
from gameon.gameon_routes import router as gameon_router

class GameOnUtils:
    class MyEncoder(json.JSONEncoder):
        def default(self, obj):
            if hasattr(obj, '__dict__'):
                return obj.__dict__
            return json.JSONEncoder.default(self, obj)

FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

app = FastAPI()

from fastapi.responses import RedirectResponse as _Redir

@app.middleware("http")
async def legacy_domain_redirect(request, call_next):
    host = request.headers.get("host", "").split(":")[0].lower()
    if host == "wordsmashing.com" or host == "www.wordsmashing.com":
        url = "https://wordsmashing.v5games.com" + request.url.path
        if request.url.query:
            url += "?" + request.url.query
        return _Redir(url, status_code=301)
    return await call_next(request)
templates = Jinja2Templates(directory=".")

@app.middleware("http")
async def add_cache_control(request: Request, call_next):
    response = await call_next(request)
    if response.headers.get("content-type", "").startswith("text/html"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

@app.on_event("startup")
async def startup_event():
    init_db()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/gameon/static", StaticFiles(directory="gameon/static"), name="gameon_static")
app.include_router(gameon_router)

STATIC_URL = '' if ws.debug else 'https://wordsmashingstatic.wordsmashing.com'

ROBOTS_TXT = 'User-agent: *\nDisallow:\nSitemap: /sitemap\n'

def get_template_values(request: Request, **kwargs):
    return {
        'request': request,
        'fixtures': fixtures,
        'ws': ws,
        'json': json,
        'GameOnUtils': GameOnUtils,
        'url': str(request.url),
        'host': request.url.hostname,
        'host_url': f"{request.url.scheme}://{request.url.netloc}",
        'path': request.url.path,
        'urlencode': urllib.parse.quote_plus,
        'static_url': STATIC_URL,
        'static_v': STATIC_V,
        **kwargs
    }

@app.get('/', response_class=HTMLResponse)
async def index(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/tests', response_class=HTMLResponse)
async def tests(request: Request):
    return templates.TemplateResponse('templates/tests.jinja2', get_template_values(request))

@app.get('/facebook', response_class=HTMLResponse)
async def facebook(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/contact', response_class=HTMLResponse)
async def contact(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/contact.jinja2', get_template_values(request, noads=noads))

@app.get('/about', response_class=HTMLResponse)
async def about(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/about.jinja2', get_template_values(request, noads=noads))

@app.get('/privacy-policy')
async def privacy_policy_redirect():
    return RedirectResponse(url='/privacy', status_code=301)

@app.get('/privacy', response_class=HTMLResponse)
async def privacy(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/privacy.jinja2', get_template_values(request, noads=noads))

@app.get('/terms', response_class=HTMLResponse)
async def terms(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/terms.jinja2', get_template_values(request, noads=noads))

@app.get('/versus', response_class=HTMLResponse)
@app.get('/versus/{subpath:path}', response_class=HTMLResponse)
async def versus(request: Request, subpath: str = None, noads: bool = True):
    return templates.TemplateResponse('templates/versus.jinja2', get_template_values(request, noads=noads))

@app.get('/timed', response_class=HTMLResponse)
async def timed(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/multiplayer', response_class=HTMLResponse)
async def multiplayer(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/versus.jinja2', get_template_values(request, noads=noads))

@app.get('/games-multiplayer', response_class=HTMLResponse)
async def games_multiplayer(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/games', response_class=HTMLResponse)
async def games(request: Request):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=True))

@app.get('/learn-english', response_class=HTMLResponse)
async def learn_english(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/learn-english.jinja2', get_template_values(
        request,
        noads=noads,
        LEARN_ENGLISH_LEVELS=((key, level) for key, level in fixtures.LEARN_ENGLISH_LEVELS.items())
    ))

@app.get('/learn-english/{urlkey}', response_class=HTMLResponse)
async def english_level(request: Request, urlkey: str, noads: bool = False):
    if urlkey == 'undefined':
        return RedirectResponse('/learn-english/girls-names')
    level = fixtures.LEARN_ENGLISH_LEVELS.get(urlkey)
    if level is None:
        raise HTTPException(status_code=404, detail='Unknown level')
    return templates.TemplateResponse('templates/learn-english-level.jinja2', get_template_values(
        request,
        noads=noads,
        level=level,
        urlkey=urlkey
    ))

@app.get('/campaign', response_class=HTMLResponse)
@app.get('/campaign/{subpath:path}', response_class=HTMLResponse)
async def campaign(request: Request, subpath: str = None, noads: bool = True):
    return templates.TemplateResponse('templates/campaign.jinja2', get_template_values(request, noads=noads))

@app.get('/blog', response_class=HTMLResponse)
async def blog_index(request: Request):
    base = f"https://{request.url.netloc}"
    ld = {"@context": "https://schema.org", "@type": "Blog", "name": "Word Smashing Blog", "url": base + "/blog",
          "publisher": {"@type": "Organization", "name": "V5 Games", "url": "https://v5games.com"},
          "blogPost": [{"@type": "BlogPosting", "headline": x["title"], "url": f"{base}/blog/{x['slug']}"} for x in blog.POSTS]}
    return templates.TemplateResponse('templates/blog.jinja2', get_template_values(
        request, noads=True, posts=blog.POSTS, blog_ld=json.dumps(ld).replace('</', '<\\/')))

@app.get('/blog/{slug}', response_class=HTMLResponse)
async def blog_post(request: Request, slug: str):
    post = blog.BY_SLUG.get(slug)
    if post is None:
        raise HTTPException(status_code=404, detail='Not Found')
    base = f"https://{request.url.netloc}"
    ld = {"@context": "https://schema.org", "@type": "Article", "headline": post["title"], "description": post["description"],
          "datePublished": blog.DATE, "dateModified": blog.DATE, "inLanguage": "en",
          "image": base + "/static/img/og-wordsmashing.png",
          "mainEntityOfPage": f"{base}/blog/{slug}",
          "author": {"@type": "Organization", "name": "V5 Games", "url": "https://v5games.com"},
          "publisher": {"@type": "Organization", "name": "V5 Games", "url": "https://v5games.com"}}
    return templates.TemplateResponse('templates/blog-post.jinja2', get_template_values(
        request, noads=True, post=post, posts=blog.POSTS, date=blog.DATE, article_ld=json.dumps(ld).replace('</', '<\\/')))

@app.get('/buy', response_class=HTMLResponse)
async def buy(request: Request):
    return templates.TemplateResponse('templates/buy.jinja2', get_template_values(request))

@app.get('/sitemap')
@app.get('/sitemap.xml')
async def sitemap(request: Request):
    content = templates.get_template('sitemap.xml').render(get_template_values(
        request,
        learnenglishlevels=fixtures.LEARN_ENGLISH_LEVELS,
        blog_posts=blog.POSTS,
        lastmod=blog.DATE
    ))
    return Response(content=content, media_type='text/xml')

@app.get('/manifest.webapp')
async def manifest_webapp():
    with open('manifest/manifest.json', 'r') as f:
        return Response(content=f.read(), media_type='application/json')

@app.get('/robots.txt')
async def robots_txt(request: Request):
    return Response(content=ROBOTS_TXT.replace('Sitemap: /sitemap', f'Sitemap: https://{request.url.netloc}/sitemap.xml'), media_type='text/plain')


def route_exists(path: str) -> bool:
    scope = {'type': 'http', 'path': path, 'method': 'GET'}
    return any(route.matches(scope)[0] == Match.FULL for route in app.router.routes)


@app.get('/{url:path}/')
async def remove_trailing_slash(url: str):
    target = f'/{url}'
    if not route_exists(target):
        raise HTTPException(status_code=404, detail='Not Found')
    return RedirectResponse(url=target)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8080)
