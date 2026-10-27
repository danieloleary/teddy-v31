#!/usr/bin/env python3
"""Read existing Teddy listings without installing or submitting anything.

Writes JSON to stdout. Run separately from offline CI because catalogs can be
unavailable. A matching atlas proves artwork bytes, not native playback.
"""
import hashlib
import io
import json
from pathlib import Path
import sys
import urllib.request
import zipfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = json.loads((ROOT / 'downloads/release.json').read_text())['files']['teddy/spritesheet.webp']['sha256']
LIMIT = 20 * 1024 * 1024

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 TeddyCatalogCheck/1.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read(LIMIT + 1)
    if len(data) > LIMIT:
        raise ValueError('Response exceeds size limit')
    return data

def check_files(manifest, atlas):
    digest = hashlib.sha256(atlas).hexdigest()
    if manifest.get('spriteVersionNumber') != 2 or digest != EXPECTED:
        raise ValueError('Catalog does not match Teddy format 2 and release atlas')
    return {'id': manifest['id'], 'display_name': manifest['displayName'],
            'sprite_version': manifest['spriteVersionNumber'], 'atlas_sha256': digest}

def check_zip(url):
    with zipfile.ZipFile(io.BytesIO(fetch(url))) as archive:
        names = archive.namelist()
        def member(basename):
            matches = [n for n in names if n.rsplit('/', 1)[-1] == basename]
            if len(matches) != 1 or archive.getinfo(matches[0]).file_size > LIMIT:
                raise ValueError('Ambiguous or oversized package member')
            return archive.read(matches[0])
        return check_files(json.loads(member('pet.json')), member('spritesheet.webp'))

def openpets():
    return check_zip('https://zip.openpets.dev/pets/teddy-0bd28606/teddy.zip')

def pet_share():
    pet = json.loads(fetch('https://codex-pets.net/api/pets/teddy'))['pet']
    result = check_files(pet, fetch(pet['spritesheetUrl']))
    download = pet['downloadUrl']
    if not download.startswith('/api/pets/teddy/download?'):
        raise ValueError('Unexpected download path')
    result['download'] = check_zip('https://codex-pets.net' + download)
    return result

def awesome():
    # Source package only: the site's npm installer is deliberately not executed.
    base = 'https://raw.githubusercontent.com/legeling/awesome-codex-pet/main/pets/teddy--danieloleary/'
    return check_files(json.loads(fetch(base + 'pet.json')), fetch(base + 'spritesheet.webp'))

if __name__ == '__main__':
    results = []
    for name, scope, run in [('OpenPets', 'served ZIP', openpets),
                             ('codex-pets.net', 'served atlas and ZIP', pet_share),
                             ('Awesome Codex Pet', 'repository package, not npm install', awesome)]:
        try:
            results.append({'catalog': name, 'scope': scope, 'status': 'match', **run()})
        except Exception as error:
            results.append({'catalog': name, 'scope': scope, 'status': 'unverified',
                            'error': str(error)})
    print(json.dumps({'checked_at': datetime.now(timezone.utc).isoformat(), 'results': results}, indent=2))
    sys.exit(any(r['status'] != 'match' for r in results))
