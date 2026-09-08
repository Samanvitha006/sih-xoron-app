"""
Generate authentic SVG artwork and cultural icons for XORON North East Dementia Care App
"""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PHOTOS_DIR = os.path.join(BASE_DIR, "static", "assets", "photos")
PATTERNS_DIR = os.path.join(BASE_DIR, "static", "assets", "patterns")

os.makedirs(PHOTOS_DIR, exist_ok=True)
os.makedirs(PATTERNS_DIR, exist_ok=True)

# 1. Dr. Priya Baruah (Daughter - Doctor)
svg_daughter = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_priya" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EBF4F6"/>
      <stop offset="100%" stop-color="#D1E8E2"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="40" fill="url(#bg_priya)"/>
  <!-- Portrait circle -->
  <circle cx="200" cy="150" r="85" fill="#F8D3B8"/>
  <!-- Hair -->
  <path d="M 115 150 C 115 70 285 70 285 150 C 285 180 275 220 270 240 C 250 200 240 130 200 130 C 160 130 150 200 130 240 Z" fill="#2C221E"/>
  <ellipse cx="200" cy="85" rx="80" ry="35" fill="#2C221E"/>
  <!-- Face features -->
  <ellipse cx="170" cy="155" rx="8" ry="5" fill="#2C221E"/>
  <ellipse cx="230" cy="155" rx="8" ry="5" fill="#2C221E"/>
  <!-- Smile -->
  <path d="M 175 190 Q 200 215 225 190" stroke="#C05840" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Red Bindi -->
  <circle cx="200" cy="135" r="4" fill="#C52828"/>
  <!-- Doctor White Coat & Turquoise Kurti -->
  <path d="M 110 400 C 110 280 140 240 200 240 C 260 240 290 280 290 400 Z" fill="#1ABC9C"/>
  <path d="M 120 400 C 125 290 145 255 175 250 L 165 400 Z" fill="#FFFFFF"/>
  <path d="M 280 400 C 275 290 255 255 225 250 L 235 400 Z" fill="#FFFFFF"/>
  <!-- Stethoscope -->
  <path d="M 165 260 C 165 330 235 330 235 260" stroke="#34495E" stroke-width="5" fill="none"/>
  <circle cx="200" cy="335" r="14" fill="#BDC3C7" stroke="#2C3E50" stroke-width="4"/>
  <!-- Badge -->
  <rect x="235" y="280" width="30" height="15" rx="3" fill="#E74C3C"/>
  <text x="200" y="380" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#0B4F48" text-anchor="middle">Dr. Priya (Daughter)</text>
</svg>"""

# 2. Rohan Baruah (Grandson - Student)
svg_rohan = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_rohan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="40" fill="url(#bg_rohan)"/>
  <!-- Face -->
  <circle cx="200" cy="155" r="80" fill="#F8D3B8"/>
  <!-- Modern Youth Hair -->
  <path d="M 120 140 C 115 80 180 50 250 65 C 280 75 285 110 280 145 C 265 115 230 110 200 112 C 165 115 140 125 120 140 Z" fill="#222"/>
  <!-- Eyes & Eyeglasses -->
  <circle cx="165" cy="155" r="18" fill="none" stroke="#2C3E50" stroke-width="4"/>
  <circle cx="235" cy="155" r="18" fill="none" stroke="#2C3E50" stroke-width="4"/>
  <line x1="183" y1="155" x2="217" y2="155" stroke="#2C3E50" stroke-width="4"/>
  <circle cx="165" cy="155" r="5" fill="#222"/>
  <circle cx="235" cy="155" r="5" fill="#222"/>
  <!-- Big Warm Youthful Smile -->
  <path d="M 165 195 Q 200 230 235 195" stroke="#C05840" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Blue College Hoodie with Gamusa Accent -->
  <path d="M 110 400 C 110 290 140 250 200 250 C 260 250 290 290 290 400 Z" fill="#2563EB"/>
  <path d="M 180 255 L 200 310 L 220 255 Z" fill="#EF4444"/>
  <text x="200" y="380" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#1E3A8A" text-anchor="middle">Rohan (Grandson)</text>
</svg>"""

# 3. Late Biren Baruah (Husband - Nostalgic Sepia / Vintage Golden)
svg_husband = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_biren" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF6E2"/>
      <stop offset="100%" stop-color="#EED9B3"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="40" fill="url(#bg_biren)"/>
  <circle cx="200" cy="150" r="80" fill="#E8C3A0"/>
  <!-- Grey / Dignified Hair -->
  <path d="M 120 150 C 120 70 280 70 280 150 C 280 170 270 180 270 190 C 260 140 240 120 200 120 C 160 120 140 140 130 190 Z" fill="#9E9E9E"/>
  <!-- Gentle Kind Eyes & Teacher Glasses -->
  <rect x="145" y="135" width="40" height="30" rx="6" fill="none" stroke="#6D4C41" stroke-width="3"/>
  <rect x="215" y="135" width="40" height="30" rx="6" fill="none" stroke="#6D4C41" stroke-width="3"/>
  <line x1="185" y1="150" x2="215" y2="150" stroke="#6D4C41" stroke-width="3"/>
  <circle cx="165" cy="150" r="4" fill="#3E2723"/>
  <circle cx="235" cy="150" r="4" fill="#3E2723"/>
  <!-- Dignified Moustache & Smile -->
  <path d="M 170 185 Q 200 175 230 185 Q 200 198 170 185 Z" fill="#BDBDBD"/>
  <path d="M 178 198 Q 200 210 222 198" stroke="#8D6E63" stroke-width="3" fill="none"/>
  <!-- Kurta & Woven Assam Gamusa -->
  <path d="M 110 400 C 110 290 140 245 200 245 C 260 245 290 290 290 400 Z" fill="#F5F5DC"/>
  <!-- Gamusa draped on shoulder -->
  <path d="M 140 250 C 140 330 150 400 150 400 L 180 400 L 170 250 Z" fill="#FFFFFF" stroke="#D32F2F" stroke-width="2"/>
  <line x1="140" y1="360" x2="180" y2="360" stroke="#D32F2F" stroke-width="4"/>
  <line x1="140" y1="375" x2="180" y2="375" stroke="#D32F2F" stroke-width="6"/>
  <text x="200" y="380" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#5D4037" text-anchor="middle">Biren (Husband - Cherished Memory)</text>
</svg>"""

# 4. Anjali Baruah (Caregiver & Daughter-in-law)
svg_anjali = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_anjali" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE7F3"/>
      <stop offset="100%" stop-color="#FBCFE8"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="40" fill="url(#bg_anjali)"/>
  <circle cx="200" cy="145" r="75" fill="#F8D3B8"/>
  <!-- Hair with bun -->
  <circle cx="200" cy="70" r="35" fill="#2C221E"/>
  <path d="M 125 150 C 125 75 275 75 275 150 C 275 190 265 210 260 220 C 240 170 230 120 200 120 C 170 120 160 170 140 220 Z" fill="#2C221E"/>
  <!-- Bindi & Features -->
  <circle cx="200" cy="128" r="4" fill="#E11D48"/>
  <ellipse cx="170" cy="145" rx="7" ry="4" fill="#2C221E"/>
  <ellipse cx="230" cy="145" rx="7" ry="4" fill="#2C221E"/>
  <path d="M 175 180 Q 200 205 225 180" stroke="#BE185D" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Traditional Mekhela Sador Yellow / Gold -->
  <path d="M 115 400 C 115 280 145 240 200 240 C 255 240 285 280 285 400 Z" fill="#FBBF24"/>
  <!-- Sador drape with red motifs -->
  <path d="M 140 250 Q 200 310 260 380 L 285 400 L 220 400 Q 180 320 130 280 Z" fill="#DC2626"/>
  <!-- Cup of tea held gently -->
  <rect x="180" y="310" width="40" height="30" rx="8" fill="#FFF" stroke="#D97706" stroke-width="2"/>
  <path d="M 220 318 Q 232 325 220 332" stroke="#D97706" stroke-width="3" fill="none"/>
  <path d="M 190 300 Q 195 290 190 285" stroke="#D97706" stroke-width="2" fill="none"/>
  <path d="M 205 300 Q 210 290 205 285" stroke="#D97706" stroke-width="2" fill="none"/>
  <text x="200" y="380" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#831843" text-anchor="middle">Anjali (Caregiver / Daughter-in-law)</text>
</svg>"""

# 5. Generic Custom Member Placeholder
svg_custom = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" rx="40" fill="#E2E8F0"/>
  <circle cx="200" cy="150" r="75" fill="#CBD5E1"/>
  <path d="M 110 380 C 110 270 150 240 200 240 C 250 240 290 270 290 380 Z" fill="#94A3B8"/>
  <circle cx="200" cy="150" r="30" fill="#64748B"/>
  <text x="200" y="340" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#334155" text-anchor="middle">Family Photo</text>
</svg>"""

# 6. Bihu Festival Memory
svg_bihu = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <defs>
    <linearGradient id="bihu_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFECD2"/>
      <stop offset="100%" stop-color="#FCB69F"/>
    </linearGradient>
  </defs>
  <rect width="500" height="350" rx="24" fill="url(#bihu_sky)"/>
  <!-- Mango Tree and Nature -->
  <path d="M 0 350 L 0 280 Q 250 240 500 280 L 500 350 Z" fill="#84CC16"/>
  <circle cx="80" cy="160" r="90" fill="#15803D" opacity="0.9"/>
  <circle cx="130" cy="130" r="80" fill="#16A34A" opacity="0.9"/>
  <!-- Dhol (Bihu Drum) -->
  <ellipse cx="250" cy="230" rx="70" ry="35" fill="#78350F"/>
  <ellipse cx="180" cy="230" rx="15" ry="35" fill="#FEF3C7" stroke="#78350F" stroke-width="4"/>
  <ellipse cx="320" cy="230" rx="15" ry="35" fill="#FEF3C7" stroke="#78350F" stroke-width="4"/>
  <!-- Drum chords -->
  <line x1="180" y1="210" x2="320" y2="245" stroke="#D97706" stroke-width="3"/>
  <line x1="180" y1="245" x2="320" y2="210" stroke="#D97706" stroke-width="3"/>
  <!-- Pepa (Buffalo Horn Flute with red tassel) -->
  <path d="M 280 180 Q 360 140 380 90" stroke="#1F2937" stroke-width="14" fill="none" stroke-linecap="round"/>
  <circle cx="380" cy="90" r="16" fill="#DC2626"/>
  <!-- Blooming Kopou (Orchid) bunch -->
  <circle cx="160" cy="100" r="8" fill="#EC4899"/>
  <circle cx="170" cy="90" r="8" fill="#F472B6"/>
  <circle cx="180" cy="102" r="8" fill="#DB2777"/>
  <circle cx="175" cy="115" r="8" fill="#F472B6"/>
  <circle cx="165" cy="125" r="8" fill="#EC4899"/>
  <text x="250" y="325" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold" fill="#78350F" text-anchor="middle">Rongali Bihu (ৰঙালী বিহু 1974)</text>
</svg>"""

# 7. Tea Garden Memory
svg_tea = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <defs>
    <linearGradient id="tea_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="60%" stop-color="#E0F2FE"/>
      <stop offset="100%" stop-color="#A7F3D0"/>
    </linearGradient>
  </defs>
  <rect width="500" height="350" rx="24" fill="url(#tea_bg)"/>
  <!-- Distant Blue Himalayan Foothills -->
  <path d="M 0 160 Q 120 100 250 140 Q 380 90 500 150 L 500 350 L 0 350 Z" fill="#6EE7B7"/>
  <path d="M 0 180 Q 150 140 300 170 Q 420 130 500 190 L 500 350 L 0 350 Z" fill="#10B981"/>
  <!-- Contoured Tea Bushes Rows -->
  <path d="M -50 250 Q 100 210 250 240 Q 400 210 550 250 L 550 350 L -50 350 Z" fill="#047857"/>
  <path d="M -50 290 Q 150 260 300 290 Q 450 260 550 300 L 550 350 L -50 350 Z" fill="#064E3B"/>
  <!-- Tea Plucker Silhouette with Jaapi -->
  <circle cx="360" cy="180" r="12" fill="#FEF08A"/>
  <!-- Jaapi hat -->
  <polygon points="335,180 360,165 385,180" fill="#CA8A04"/>
  <polygon points="350,180 360,172 370,180" fill="#DC2626"/>
  <!-- Basket on back -->
  <rect x="370" y="185" width="20" height="30" rx="4" fill="#B45309"/>
  <text x="250" y="335" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Tezpur Tea Garden & Cottage (1968)</text>
</svg>"""

# 8. Graduation Memory
svg_grad = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_bg" x1="0" y1="0" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EFF6FF"/>
      <stop offset="100%" stop-color="#DBEAFE"/>
    </linearGradient>
  </defs>
  <rect width="500" height="350" rx="24" fill="url(#grad_bg)"/>
  <!-- University Arch -->
  <path d="M 80 350 L 80 120 Q 250 50 420 120 L 420 350" stroke="#93C5FD" stroke-width="8" fill="none"/>
  <!-- Graduation Mortarboard Hat -->
  <polygon points="250,90 350,130 250,170 150,130" fill="#1E3A8A"/>
  <rect x="200" y="160" width="100" height="35" rx="6" fill="#1E40AF"/>
  <circle cx="250" cy="130" r="8" fill="#F59E0B"/>
  <line x1="250" y1="130" x2="330" y2="180" stroke="#F59E0B" stroke-width="4"/>
  <!-- Diploma with Red Ribbon -->
  <rect x="180" y="220" width="140" height="40" rx="8" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
  <rect x="240" y="218" width="20" height="44" fill="#DC2626"/>
  <!-- Traditional Assamese Gamusa felicitation -->
  <rect x="150" y="280" width="200" height="24" fill="#FFFFFF" stroke="#DC2626" stroke-width="2"/>
  <line x1="160" y1="280" x2="160" y2="304" stroke="#DC2626" stroke-width="4"/>
  <line x1="340" y1="280" x2="340" y2="304" stroke="#DC2626" stroke-width="4"/>
  <text x="250" y="335" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#1E3A8A" text-anchor="middle">Dr. Priya's MBBS Gold Medal Day (2002)</text>
</svg>"""

# 9. Traditional Utensil - Assamese Xorai (bell metal)
svg_xorai = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Stand base -->
  <ellipse cx="100" cy="175" rx="60" ry="15" fill="#D97706"/>
  <path d="M 85 175 L 95 110 L 105 110 L 115 175 Z" fill="#F59E0B"/>
  <!-- Middle Tier -->
  <ellipse cx="100" cy="110" rx="35" ry="8" fill="#D97706"/>
  <path d="M 92 110 L 96 75 L 104 75 L 108 110 Z" fill="#F59E0B"/>
  <!-- Top Plate -->
  <ellipse cx="100" cy="75" rx="75" ry="20" fill="#FBBF24" stroke="#B45309" stroke-width="3"/>
  <!-- Xorai Cone Dome / Lid with finial -->
  <path d="M 40 75 Q 100 -5 160 75 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
  <circle cx="100" cy="10" r="8" fill="#FBBF24"/>
  <!-- Traditional red border cloth -->
  <path d="M 50 78 Q 100 88 150 78" stroke="#DC2626" stroke-width="5" fill="none"/>
</svg>"""

# 10. Traditional Jaapi (Conical Sun Hat)
svg_jaapi = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <!-- Outer Woven Bamboo Brim -->
  <polygon points="100,20 185,160 15,160" fill="#FEF08A" stroke="#CA8A04" stroke-width="4"/>
  <!-- Concentric traditional red & green circular cloth patterns -->
  <polygon points="100,50 160,150 40,150" fill="#EF4444"/>
  <polygon points="100,80 140,145 60,145" fill="#10B981"/>
  <polygon points="100,105 125,142 75,142" fill="#FEF08A"/>
  <!-- Center red peak -->
  <circle cx="100" cy="35" r="10" fill="#DC2626"/>
  <circle cx="100" cy="130" r="8" fill="#DC2626"/>
  <!-- Red fringe tassels -->
  <line x1="20" y1="160" x2="15" y2="175" stroke="#DC2626" stroke-width="3"/>
  <line x1="60" y1="160" x2="58" y2="175" stroke="#DC2626" stroke-width="3"/>
  <line x1="100" y1="160" x2="100" y2="175" stroke="#DC2626" stroke-width="3"/>
  <line x1="140" y1="160" x2="142" y2="175" stroke="#DC2626" stroke-width="3"/>
  <line x1="180" y1="160" x2="185" y2="175" stroke="#DC2626" stroke-width="3"/>
</svg>"""

# 11. Traditional Gamusa Motif
svg_gamusa = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <!-- Red woven floral border -->
  <rect x="0" y="20" width="200" height="15" fill="#DC2626"/>
  <rect x="0" y="45" width="200" height="8" fill="#DC2626"/>
  <!-- Intricate woven diamond motifs -->
  <polygon points="40,90 55,75 70,90 55,105" fill="#DC2626"/>
  <polygon points="90,90 105,75 120,90 105,105" fill="#DC2626"/>
  <polygon points="140,90 155,75 170,90 155,105" fill="#DC2626"/>
  <!-- Paisley / Gathia flower motif -->
  <circle cx="55" cy="90" r="4" fill="#FFFFFF"/>
  <circle cx="105" cy="90" r="4" fill="#FFFFFF"/>
  <circle cx="155" cy="90" r="4" fill="#FFFFFF"/>
  <!-- Fringe tassels at bottom -->
  <line x1="0" y1="165" x2="200" y2="165" stroke="#DC2626" stroke-width="6"/>
  <path d="M 10 170 L 10 195 M 30 170 L 30 195 M 50 170 L 50 195 M 70 170 L 70 195 M 90 170 L 90 195 M 110 170 L 110 195 M 130 170 L 130 195 M 150 170 L 150 195 M 170 170 L 170 195 M 190 170 L 190 195" stroke="#DC2626" stroke-width="3"/>
</svg>"""

# 12. Kopou Phool (Foxtail Orchid)
svg_kopou = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#FDF2F8" rx="20"/>
  <!-- Gentle curved green stem -->
  <path d="M 60 20 Q 90 90 140 180" stroke="#15803D" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- Drooping pink orchid blossoms -->
  <g fill="#F472B6" stroke="#DB2777" stroke-width="1.5">
    <ellipse cx="65" cy="35" rx="14" ry="10" transform="rotate(-15 65 35)"/>
    <circle cx="65" cy="35" r="4" fill="#FDF2F8"/>
    <ellipse cx="80" cy="60" rx="16" ry="11" transform="rotate(-10 80 60)"/>
    <circle cx="80" cy="60" r="4" fill="#FDF2F8"/>
    <ellipse cx="95" cy="88" rx="18" ry="12"/>
    <circle cx="95" cy="88" r="5" fill="#FDF2F8"/>
    <ellipse cx="110" cy="118" rx="19" ry="13" transform="rotate(10 110 118)"/>
    <circle cx="110" cy="118" r="5" fill="#FDF2F8"/>
    <ellipse cx="125" cy="148" rx="17" ry="12" transform="rotate(15 125 148)"/>
    <circle cx="125" cy="148" r="4" fill="#FDF2F8"/>
    <ellipse cx="138" cy="175" rx="14" ry="10" transform="rotate(20 138 175)"/>
    <circle cx="138" cy="175" r="3" fill="#FDF2F8"/>
  </g>
</svg>"""

files = {
    os.path.join(PHOTOS_DIR, "daughter_priya.svg"): svg_daughter,
    os.path.join(PHOTOS_DIR, "grandson_rohan.svg"): svg_rohan,
    os.path.join(PHOTOS_DIR, "husband_biren.svg"): svg_husband,
    os.path.join(PHOTOS_DIR, "caregiver_anjali.svg"): svg_anjali,
    os.path.join(PHOTOS_DIR, "custom_member.svg"): svg_custom,
    os.path.join(PHOTOS_DIR, "bihu_memory.svg"): svg_bihu,
    os.path.join(PHOTOS_DIR, "tea_memory.svg"): svg_tea,
    os.path.join(PHOTOS_DIR, "graduation_memory.svg"): svg_grad,
    os.path.join(PATTERNS_DIR, "xorai.svg"): svg_xorai,
    os.path.join(PATTERNS_DIR, "jaapi.svg"): svg_jaapi,
    os.path.join(PATTERNS_DIR, "gamusa.svg"): svg_gamusa,
    os.path.join(PATTERNS_DIR, "kopou.svg"): svg_kopou,
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(files)} authentic SVG assets in {PHOTOS_DIR} and {PATTERNS_DIR}")
