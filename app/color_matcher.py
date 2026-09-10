import math
from typing import Tuple

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    clean_hex = hex_code.lstrip('#')
    if len(clean_hex) != 6:
        raise ValueError("Invalid hex color code")
    return int(clean_hex[0:2], 16), int(clean_hex[2:4], 16), int(clean_hex[4:6], 16)

def rgb_to_xyz(r: int, g: int, b: int) -> Tuple[float, float, float]:
    # Pivot sRGB to linear RGB
    def pivot(c):
        c = c / 255.0
        return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

    r_lin = pivot(r) * 100.0
    g_lin = pivot(g) * 100.0
    b_lin = pivot(b) * 100.0

    # sRGB D65 matrix transformation
    x = r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375
    y = r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750
    z = r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041
    return x, y, z

def xyz_to_lab(x: float, y: float, z: float) -> Tuple[float, float, float]:
    # Observer=2°, Illuminant=D65
    ref_x = 95.047
    ref_y = 100.000
    ref_z = 108.883

    def pivot(v):
        return v ** (1.0 / 3.0) if v > 0.008856 else (7.787 * v) + (16.0 / 116.0)

    px = pivot(x / ref_x)
    py = pivot(y / ref_y)
    pz = pivot(z / ref_z)

    l = max(0.0, (116.0 * py) - 16.0)
    a = 500.0 * (px - py)
    b = 200.0 * (py - pz)
    return l, a, b

def hex_to_lab(hex_code: str) -> Tuple[float, float, float]:
    r, g, b = hex_to_rgb(hex_code)
    x, y, z = rgb_to_xyz(r, g, b)
    return xyz_to_lab(x, y, z)

def calculate_delta_e(hex1: str, hex2: str) -> float:
    """Calculates CIE76 Euclidean Delta-E distance between two hex codes."""
    l1, a1, b1 = hex_to_lab(hex1)
    l2, a2, b2 = hex_to_lab(hex2)
    delta_l = l1 - l2
    delta_a = a1 - a2
    delta_b = b1 - b2
    return math.sqrt(delta_l ** 2 + delta_a ** 2 + delta_b ** 2)

def calculate_match_confidence(delta_e: float, undertone_match: bool, finish_match: bool) -> float:
    """
    Computes a match percentage score (0-100%).
    Delta-E < 2.3 is indistinguishable to human eye (confidence > 96%).
    """
    # Base proximity score
    base_score = max(0.0, 100.0 - (delta_e * 2.8))
    
    # Bonuses / Penalties for exact undertone and finish alignments
    if undertone_match:
        base_score = min(100.0, base_score + 2.0)
    else:
        base_score = max(0.0, base_score - 8.0)

    if finish_match:
        base_score = min(100.0, base_score + 1.5)

    return round(max(10.0, min(99.9, base_score)), 1)
