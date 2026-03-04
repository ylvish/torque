from PIL import Image
import os

jpg_path = r'app\WhatsApp Image 2026-03-04 at 7.57.42 PM (1).jpeg'
ico_path = r'public\favicon.ico'

try:
    img = Image.open(jpg_path)
    # Ensure image is square for best results or it will be distorted
    # Actually ICO supports non-square but square is best.
    width, height = img.size
    size = min(width, height)
    left = (width - size) / 2
    top = (height - size) / 2
    right = (width + size) / 2
    bottom = (height + size) / 2
    img = img.crop((left, top, right, bottom))
    
    img.save(ico_path, format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
    print("Successfully converted to ICO")
except Exception as e:
    print(f"Error converting image: {e}")
