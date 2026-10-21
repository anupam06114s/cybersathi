import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs(r"c:\Users\hp\Desktop\cybersathii\public\diagrams", exist_ok=True)

# -------------------------------------------------------------
# DIAGRAM 1: End-to-End System Architectural Workflow Diagram
# -------------------------------------------------------------
def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.2), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')
    ax.axis('off')

    # Boxes: [x, y, w, h, text, color, border]
    boxes = [
        (0.04, 0.58, 0.16, 0.32, "User Terminal\n(Browser / React 19)\n• Input 10-Digit Query\n• Geolocation Origin\n• Mode (Drive/Bike)", "#032B44", "#00F0FF"),
        (0.25, 0.58, 0.18, 0.32, "Next.js 16 Server\n(API Route Handlers)\n• libphonenumber-js\n• E.164 Normalization\n• Edge / Node Runtime", "#0F172A", "#38BDF8"),
        (0.48, 0.58, 0.22, 0.32, "Telemetry / Data API\n(Protected Ingestion)\n• Secure Upstream Proxy\n• Subscriber Record Sync\n• Alternate Contact Links", "#1E1B4B", "#818CF8"),
        (0.75, 0.58, 0.21, 0.32, "Identity Redaction\nFilter Engine\n• Strip Father's Name\n• Strip House/Flat No.\n• Extract Village/District", "#31102A", "#F43F5E"),
        
        # Second row
        (0.12, 0.10, 0.22, 0.32, "Geocoding Service\n(OSM Nominatim)\n• Hierarchical Lookup\n• Pincode/District Centroid\n• Resolves Lat / Lon", "#143324", "#34D399"),
        (0.40, 0.10, 0.24, 0.32, "Mathematical & Telemetry Engine\n• Haversine Aerial Distance (KM)\n• Forward Azimuth Compass Bearing\n• (N, NE, E, SE, S, SW, W, NW)", "#2E1A47", "#A855F7"),
        (0.70, 0.10, 0.24, 0.32, "Navigation & Routing (OSRM)\n• Turn-by-Turn Road Route\n• Live Traffic Route Vectors\n• Google Maps Deep Navigation", "#382305", "#FBBF24"),
    ]

    for x, y, w, h, txt, bg, border in boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.015,rounding_size=0.02",
                                      facecolor=bg, edgecolor=border, linewidth=1.8)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, txt, color='#F8FAFC', fontsize=8.2, fontweight='bold',
                ha='center', va='center', family='sans-serif', multialignment='center')

    # Draw arrows connecting blocks
    arrow_props = dict(arrowstyle="->,head_width=0.35,head_length=0.45", color="#00F0FF", lw=1.6)
    
    # 1 -> 2
    ax.annotate("", xy=(0.25, 0.74), xytext=(0.20, 0.74), arrowprops=arrow_props)
    # 2 -> 3
    ax.annotate("", xy=(0.48, 0.74), xytext=(0.43, 0.74), arrowprops=arrow_props)
    # 3 -> 4
    ax.annotate("", xy=(0.75, 0.74), xytext=(0.70, 0.74), arrowprops=arrow_props)

    # 4 -> down to 5 (curved connector)
    ax.annotate("", xy=(0.23, 0.42), xytext=(0.85, 0.58),
                arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45", color="#F43F5E",
                                connectionstyle="angle,angleA=0,angleB=90,rad=10", lw=1.6))

    # 5 -> 6
    ax.annotate("", xy=(0.40, 0.26), xytext=(0.34, 0.26), arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45", color="#34D399", lw=1.6))
    # 6 -> 7
    ax.annotate("", xy=(0.70, 0.26), xytext=(0.64, 0.26), arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45", color="#A855F7", lw=1.6))

    # Feedback loop 7 back to 1
    ax.annotate("Visual Telemetry Dispatched to User UI", xy=(0.10, 0.58), xytext=(0.82, 0.10),
                arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45", color="#FBBF24",
                                connectionstyle="angle,angleA=-90,angleB=180,rad=15", lw=1.4, linestyle="--"),
                color="#FBBF24", fontsize=7.2, fontweight='bold', ha='center')

    plt.tight_layout()
    out_path = r"c:\Users\hp\Desktop\cybersathii\public\diagrams\architecture_workflow.png"
    plt.savefig(out_path, dpi=300, facecolor='#0B0F19', bbox_inches='tight')
    plt.close()
    print(f"Generated {out_path}")

# -------------------------------------------------------------
# DIAGRAM 2: Privacy-Preserving Geocoding & Redaction Pipeline
# -------------------------------------------------------------
def generate_geocoding_diagram():
    fig, ax = plt.subplots(figsize=(10, 3.8), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')
    ax.axis('off')

    steps = [
        (0.04, 0.35, 0.20, 0.50, "Raw Address Input\n(From Telecom Record)\n\n'Flat 1506!Shri Ram Lal!\nVPO Khera Kalan!Dist Meerut!\nUttar Pradesh 250001'", "#1E293B", "#94A3B8"),
        (0.28, 0.35, 0.22, 0.50, "Identity Redaction Filter\n(extractLocationForGeocoding)\n\n• Discard 'Shri Ram Lal' (Father)\n• Discard 'Flat 1506' (Unit)\n• Retain Geographic Tokens", "#450A0A", "#EF4444"),
        (0.54, 0.35, 0.20, 0.50, "Sanitized Location\n\n'VPO Khera Kalan, Meerut,\nUttar Pradesh, 250001'\n\nResult: 100% Geocodable", "#064E3B", "#10B981"),
        (0.78, 0.35, 0.18, 0.50, "OpenStreetMap Query\n\nResolved Coordinates:\nLat: 28.9845 N\nLon: 77.7064 E\nPrecision: Village / Centroid", "#172554", "#3B82F6"),
    ]

    for x, y, w, h, txt, bg, border in steps:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.015,rounding_size=0.02",
                                      facecolor=bg, edgecolor=border, linewidth=1.8)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, txt, color='#F8FAFC', fontsize=8.0, fontweight='bold',
                ha='center', va='center', family='sans-serif', multialignment='center')

    # Arrows
    arrow_props = dict(arrowstyle="->,head_width=0.35,head_length=0.45", color="#38BDF8", lw=1.8)
    ax.annotate("", xy=(0.28, 0.60), xytext=(0.24, 0.60), arrowprops=arrow_props)
    ax.annotate("", xy=(0.54, 0.60), xytext=(0.50, 0.60), arrowprops=arrow_props)
    ax.annotate("", xy=(0.78, 0.60), xytext=(0.74, 0.60), arrowprops=arrow_props)

    # Bottom notes
    ax.text(0.50, 0.12, "Privacy & Geocoding Guarantee: Zero personal identity leakage to external mapping servers; 95%+ match reliability.",
            color='#38BDF8', fontsize=8.5, fontweight='bold', ha='center', va='center', style='italic')

    plt.tight_layout()
    out_path = r"c:\Users\hp\Desktop\cybersathii\public\diagrams\geocoding_workflow.png"
    plt.savefig(out_path, dpi=300, facecolor='#0B0F19', bbox_inches='tight')
    plt.close()
    print(f"Generated {out_path}")

# -------------------------------------------------------------
# DIAGRAM 3: Distance (Haversine) & Compass Direction Math Diagram
# -------------------------------------------------------------
def generate_telemetry_diagram():
    fig, ax = plt.subplots(figsize=(10, 3.8), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')
    ax.axis('off')

    # Left: Origin
    rect1 = patches.FancyBboxPatch((0.05, 0.30), 0.22, 0.55, boxstyle="round,pad=0.015,rounding_size=0.02",
                                  facecolor='#032B44', edgecolor='#00F0FF', linewidth=1.8)
    ax.add_patch(rect1)
    ax.text(0.16, 0.58, "Origin Coordinates\n(Investigator / User)\n(Lat1, Lon1)\ne.g., New Delhi\n28.6139 N, 77.2090 E",
            color='#F8FAFC', fontsize=8.2, fontweight='bold', ha='center', va='center')

    # Right: Destination
    rect2 = patches.FancyBboxPatch((0.73, 0.30), 0.22, 0.55, boxstyle="round,pad=0.015,rounding_size=0.02",
                                  facecolor='#31102A', edgecolor='#F43F5E', linewidth=1.8)
    ax.add_patch(rect2)
    ax.text(0.84, 0.58, "Target Coordinates\n(Caller Village/District)\n(Lat2, Lon2)\ne.g., Meerut, UP\n28.9845 N, 77.7064 E",
            color='#F8FAFC', fontsize=8.2, fontweight='bold', ha='center', va='center')

    # Middle Center Boxes: Haversine & Bearing
    rect_mid_top = patches.FancyBboxPatch((0.31, 0.56), 0.38, 0.34, boxstyle="round,pad=0.015,rounding_size=0.02",
                                          facecolor='#2E1A47', edgecolor='#C084FC', linewidth=1.6)
    ax.add_patch(rect_mid_top)
    ax.text(0.50, 0.73, "Straight-Line Displacement (Haversine)\nDistance = 64.2 km (Aerial)\nd = 2R * asin(sqrt(sin^2(dlat/2) + cos*cos*sin^2(dlon/2)))",
            color='#F8FAFC', fontsize=8.0, fontweight='bold', ha='center', va='center')

    rect_mid_bot = patches.FancyBboxPatch((0.31, 0.16), 0.38, 0.34, boxstyle="round,pad=0.015,rounding_size=0.02",
                                          facecolor='#382305', edgecolor='#FBBF24', linewidth=1.6)
    ax.add_patch(rect_mid_bot)
    ax.text(0.50, 0.33, "Forward Azimuth Compass Bearing\nDirection: NE (North-East) @ 48 deg\nRoad Route: 74.5 km | Travel Time: 1h 22m (via NH 334)",
            color='#F8FAFC', fontsize=8.0, fontweight='bold', ha='center', va='center')

    # Connecting arrows
    ax.annotate("", xy=(0.31, 0.73), xytext=(0.27, 0.65), arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.4", color='#C084FC', lw=1.8))
    ax.annotate("", xy=(0.73, 0.73), xytext=(0.69, 0.73), arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.4", color='#C084FC', lw=1.8))
    
    ax.annotate("", xy=(0.31, 0.33), xytext=(0.27, 0.45), arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.4", color='#FBBF24', lw=1.8))
    ax.annotate("", xy=(0.73, 0.45), xytext=(0.69, 0.33), arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.4", color='#FBBF24', lw=1.8))

    plt.tight_layout()
    out_path = r"c:\Users\hp\Desktop\cybersathii\public\diagrams\telemetry_workflow.png"
    plt.savefig(out_path, dpi=300, facecolor='#0B0F19', bbox_inches='tight')
    plt.close()
    print(f"Generated {out_path}")


if __name__ == "__main__":
    generate_architecture_diagram()
    generate_geocoding_diagram()
    generate_telemetry_diagram()
