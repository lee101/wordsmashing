import hashlib
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def compute(dirs=('static/js', 'static/css', 'templates/shared')):
    h = hashlib.sha1()
    for d in dirs:
        for dirpath, dirnames, files in os.walk(os.path.join(ROOT, d)):
            dirnames.sort()
            for f in sorted(files):
                p = os.path.join(dirpath, f)
                h.update(os.path.relpath(p, ROOT).encode())
                with open(p, 'rb') as fh:
                    h.update(fh.read())
    return h.hexdigest()[:10]


STATIC_V = compute()

if __name__ == '__main__':
    print(STATIC_V)
