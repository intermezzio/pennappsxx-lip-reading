from pathlib import Path
import os
for root, dirs, files in os.walk(r'./uploads'):
    for file in files:
        if file.endswith('.webm'):
            print("ffmpeg -y -i uploads/"+ file + " -qscale 0 proc_uploads/"+Path(file).stem + ".mp4")
            os.system("ffmpeg -y -i uploads/"+ file + " -qscale 0 proc_uploads/"+Path(file).stem + ".mp4")
