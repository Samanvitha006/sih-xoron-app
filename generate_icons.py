"""
Generate high-resolution Android App launcher icons for XORON PWA
"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "static", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_icon(size, output_path, maskable=False):
    # Warm amber gradient background
    img = Image.new("RGBA", (size, size), (250, 247, 242, 255))
    draw = ImageDraw.Draw(img)

    margin = size * 0.1 if maskable else size * 0.05
    radius = size * 0.22 if not maskable else size * 0.1

    # Rounded square background tile in rich amber gold
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=(180, 83, 9, 255), # Amber-700
        outline=(217, 119, 6, 255), # Amber-500
        width=int(size * 0.02)
    )

    # Inner circular badge in soft gold
    center = size / 2
    r_circle = size * 0.28
    draw.ellipse(
        [center - r_circle, center - r_circle, center + r_circle, center + r_circle],
        fill=(254, 243, 199, 255) # Amber-100
    )

    # Draw brain silhouette / stylized orchid nodes
    # Left hemisphere
    draw.ellipse([center - size*0.18, center - size*0.16, center - size*0.02, center + size*0.06], fill=(217, 119, 6, 255))
    draw.ellipse([center - size*0.16, center - size*0.05, center - size*0.01, center + size*0.16], fill=(180, 83, 9, 255))

    # Right hemisphere
    draw.ellipse([center + size*0.02, center - size*0.16, center + size*0.18, center + size*0.06], fill=(5, 150, 105, 255)) # Emerald
    draw.ellipse([center + size*0.01, center - size*0.05, center + size*0.16, center + size*0.16], fill=(4, 120, 87, 255))

    # Center stem line
    draw.line([center, center - size*0.18, center, center + size*0.18], fill=(255, 255, 255, 255), width=int(size * 0.025))

    # Top blooming orchid petal
    draw.ellipse([center - size*0.06, center - size*0.24, center + size*0.06, center - size*0.12], fill=(236, 72, 153, 255)) # Pink orchid

    img.save(output_path, "PNG")
    print(f"Generated icon: {output_path} ({size}x{size})")

if __name__ == "__main__":
    create_icon(192, os.path.join(ASSETS_DIR, "icon-192.png"))
    create_icon(512, os.path.join(ASSETS_DIR, "icon-512.png"))
    create_icon(512, os.path.join(ASSETS_DIR, "icon-maskable.png"), maskable=True)
