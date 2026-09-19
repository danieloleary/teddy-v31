#!/usr/bin/env python3
"""Render the shipped sprite atlas into a silent, captioned demonstration."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess, json, hashlib
root=Path(__file__).resolve().parents[1]
assets=root/'v5/assets'
states=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {STATES} from './v5/animation.mjs'; console.log(JSON.stringify(STATES));"],cwd=root,text=True))
by_id={s['id']:s for s in states}
atlas=Image.open(assets/'spritesheet.webp').convert('RGBA')
# Use a supplied font for portable builds; macOS defaults keep this local export reproducible.
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--font',default='/System/Library/Fonts/Supplemental/Georgia.ttf');args=parser.parse_args()
large=ImageFont.truetype(args.font,62);small=ImageFont.truetype(args.font,27);label=ImageFont.truetype(args.font,22)
segments=[(0,3,'waving','Hello, Teddy.','Round glasses. Navy cardigan.'),(3,6,'waiting','Your turn.','He can wait.'),(6,9,'running','Working on it.','The tablet is getting some attention.'),(9,12,'review','One closer look.','A glasses adjustment. Naturally.'),(12,15,'jumping','A small celebration.','Both feet off the ground.'),(15,19,'looks','Catch his eye.','Sixteen ways to look around.'),(19,20,'idle','Make room for Teddy.','A free animated pet for Codex.')]
proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1280x720','-framerate','30','-i','-','-an','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(assets/'teddy-demo.mp4')],stdin=subprocess.PIPE)
for n in range(600):
 t=n/30
 start,end,state,title,description=next(s for s in segments if s[0]<=t<s[1])
 if state=='looks':i=min(15,int((t-start)*4));row,col=9+i//8,i%8
 else:
  s=by_id[state];dt=((t-start)*1000)%sum(s['durations']);col=0
  for i,d in enumerate(s['durations']):
   if dt<d:col=i;break
   dt-=d
  row=s['row']
 frame=Image.new('RGB',(1280,720),'#fff8ed');draw=ImageDraw.Draw(frame)
 draw.ellipse((735,116,1190,574),fill='#f0dfb8')
 draw.text((70,65),'TEDDY 5.0',font=small,fill='#405942');draw.text((70,253),title,font=large,fill='#27332e');draw.text((70,348),description,font=small,fill='#686b5d')
 draw.text((70,600),'Animation demo · Actual downloadable artwork',font=label,fill='#686b5d');draw.text((70,642),'danieloleary.github.io/teddy-v31',font=label,fill='#405942')
 sprite=atlas.crop((col*192,row*208,(col+1)*192,(row+1)*208)).resize((384,416),Image.Resampling.LANCZOS)
 frame.paste(sprite,(780,145),sprite)
 if n==0:frame.save(assets/'demo-poster.jpg',quality=90)
 proc.stdin.write(frame.tobytes())
proc.stdin.close();assert proc.wait()==0
captions=['Teddy waves hello.','Teddy rests his cheek while waiting.','Teddy taps his tablet.','Teddy adjusts his glasses for a closer look.','Teddy makes a small hop.','Teddy turns his head through sixteen directions.','Teddy rests with his tablet.']
def stamp(t):return f'00:00:{t:02d}.000'
(assets/'teddy-demo.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(s[0])} --> {stamp(s[1])}\n{c}' for s,c in zip(segments,captions))+'\n')
print(json.dumps({'seconds':20,'frames':600,'bytes':(assets/'teddy-demo.mp4').stat().st_size,'source_sha256':hashlib.sha256((assets/'spritesheet.webp').read_bytes()).hexdigest()}))
