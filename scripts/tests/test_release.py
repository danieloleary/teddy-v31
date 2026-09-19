import importlib.util
import io
import json
import os
from pathlib import Path
import stat
import tempfile
import unittest
import zipfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
r = importlib.util.module_from_spec(spec); spec.loader.exec_module(r)

class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        atlas = self.root / "fixture.webp"
        Image.new("RGBA", (1536,2288), (0,0,0,0)).save(atlas, lossless=True)
        self.atlas = atlas
        self.receipt = r.build(atlas, self.root / "a", ROOT / "v5/release.json")
        self.archive = self.root / "a" / self.receipt["archive"]
        self.sha = self.receipt["sha256"]

    def test_reproducible_and_exact_contents(self):
        second = r.build(self.atlas, self.root / "b", ROOT / "v5/release.json")
        self.assertEqual(self.sha, second["sha256"])
        self.assertEqual(set(r.verify(self.archive,self.sha)),r.FILES)

    def test_fresh_upgrade_and_restore_preserve_unrelated_files(self):
        fresh = self.root / "fresh"
        r.install(self.archive,self.sha,fresh)
        self.assertEqual(json.loads((fresh/'pet.json').read_text())["spriteVersionNumber"],2)
        dest = self.root / "teddy";dest.mkdir()
        (dest/'pet.json').write_bytes(b'old metadata')
        (dest/'spritesheet.webp').write_bytes(b'old image')
        (dest/'note.txt').write_text('keep me')
        r.install(self.archive,self.sha,dest)
        self.assertEqual((dest/'note.txt').read_text(),'keep me')
        with self.assertRaises(ValueError):r.install(self.archive,self.sha,dest)
        r.restore(dest)
        self.assertEqual((dest/'pet.json').read_bytes(),b'old metadata')
        self.assertEqual((dest/'spritesheet.webp').read_bytes(),b'old image')
        self.assertTrue((self.root/'.teddy-recovery/teddy.v5-restored-away').is_dir())

    def test_interruption_restores_exact_pair(self):
        dest = self.root/'teddy';dest.mkdir()
        for name in ('pet.json','spritesheet.webp'):(dest/name).write_bytes(name.encode())
        for failpoint in ('before-replace','after-backup'):
            with self.assertRaises(OSError):r.install(self.archive,self.sha,dest,failpoint)
            for name in ('pet.json','spritesheet.webp'):self.assertEqual((dest/name).read_bytes(),name.encode())
            self.assertFalse((self.root/'.teddy-recovery/teddy.pre-v5').exists())

    def test_bad_digest_cannot_mutate_destination(self):
        with self.assertRaises(ValueError):r.install(self.archive,'0'*64,self.root/'nope')
        self.assertFalse((self.root/'nope').exists())

    def test_incomplete_existing_pet_is_preserved(self):
        dest=self.root/'partial';dest.mkdir();(dest/'pet.json').write_text('keep')
        with self.assertRaises(ValueError):r.install(self.archive,self.sha,dest)
        self.assertEqual((dest/'pet.json').read_text(),'keep')
        self.assertFalse((dest/'spritesheet.webp').exists())

    def test_archive_rejects_paths_symlinks_missing_files_and_bad_schema(self):
        good = r.verify(self.archive,self.sha)
        cases = [ {'../pet.json':b'{}'}, {k:v for k,v in good.items() if k.endswith('pet.json')},
                 {**good, 'teddy/extra':b'bad'}, {**good,'teddy/pet.json':b'{}'} ]
        for files in cases:
            out = io.BytesIO()
            with zipfile.ZipFile(out,'w') as z:
                for name,data in files.items():z.writestr(name,data)
            bad = self.root/'bad.zip';bad.write_bytes(out.getvalue())
            with self.assertRaises(ValueError):r.verify(bad,r.digest(out.getvalue()))
        out = io.BytesIO()
        with zipfile.ZipFile(out,'w') as z:
            for name,data in good.items():
                i=zipfile.ZipInfo(name);i.create_system=3;i.external_attr=(stat.S_IFLNK|0o777)<<16;z.writestr(i,data)
        bad.write_bytes(out.getvalue())
        with self.assertRaises(ValueError):r.verify(bad,r.digest(out.getvalue()))

    def test_symlink_destination_and_bad_geometry_rejected(self):
        link=self.root/'linked';link.symlink_to(self.root/'target')
        with self.assertRaises(ValueError):r.install(self.archive,self.sha,link)
        Image.new('RGBA',(192,208)).save(self.atlas,lossless=True)
        with self.assertRaises(ValueError):r.build(self.atlas,self.root/'bad',ROOT/'v5/release.json')

    def test_corrupt_zip_and_unwritable_parent_preserve_old_pet(self):
        broken=self.root/'broken.zip';broken.write_bytes(b'not a zip')
        with self.assertRaises(zipfile.BadZipFile):r.verify(broken,r.digest(broken.read_bytes()))
        parent=self.root/'locked';parent.mkdir();dest=parent/'teddy';dest.mkdir()
        for name in ('pet.json','spritesheet.webp'):(dest/name).write_text('old')
        if os.geteuid()==0:self.skipTest('Permission enforcement requires a non-root user')
        parent.chmod(0o500)
        try:
            with self.assertRaises(PermissionError):r.install(self.archive,self.sha,dest)
            self.assertEqual((dest/'pet.json').read_text(),'old')
            self.assertEqual((dest/'spritesheet.webp').read_text(),'old')
        finally:parent.chmod(0o700)

    def test_restore_after_abrupt_interruption_with_missing_destination(self):
        recovery=self.root/'.teddy-recovery/teddy.pre-v5';recovery.mkdir(parents=True)
        for name in ('pet.json','spritesheet.webp'):(recovery/name).write_bytes(name.encode())
        dest=self.root/'teddy';receipt=r.restore(dest)
        self.assertIsNone(receipt['retained_candidate'])
        for name in ('pet.json','spritesheet.webp'):self.assertEqual((dest/name).read_bytes(),name.encode())

    def test_recovery_and_staging_do_not_appear_as_extra_pets(self):
        pets=self.root/'pets';pets.mkdir();dest=pets/'teddy';dest.mkdir()
        for name in ('pet.json','spritesheet.webp'):(dest/name).write_text('old')
        r.install(self.archive,self.sha,dest)
        discoverable=[p.name for p in pets.iterdir() if p.is_dir() and (p/'pet.json').is_file()]
        self.assertEqual(discoverable,['teddy'])
        self.assertTrue((pets/'.teddy-recovery/teddy.pre-v5/pet.json').is_file())

if __name__ == '__main__':unittest.main()
