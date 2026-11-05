import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Theme colors
    PRIMARY_DARK = RGBColor(15, 23, 42)    # #0f172a
    SKY_BLUE = RGBColor(2, 132, 199)       # #0284c7
    AMBER_GOLD = RGBColor(245, 158, 11)    # #f59e0b
    CARD_BG = RGBColor(248, 250, 252)      # #f8fafc
    WHITE = RGBColor(255, 255, 255)
    GRAY_TEXT = RGBColor(100, 116, 139)    # #64748b
    DARK_TEXT = RGBColor(30, 41, 59)       # #1e293b
    BORDER_COLOR = RGBColor(226, 232, 240)

    def add_header(slide, title, subtitle):
        # Header banner text
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.2))
        tf = txBox.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE

        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(14)
        p2.font.color.rgb = GRAY_TEXT

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE (Dark theme)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = PRIMARY_DARK
    bg1.line.color.rgb = PRIMARY_DARK

    tbox1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(3.8))
    tf1 = tbox1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "SINDH STREAM 2026-27"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = AMBER_GOLD

    p2 = tf1.add_paragraph()
    p2.text = "Flood & Heatwave Early Warning System"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

    p3 = tf1.add_paragraph()
    p3.text = "Hyperlocal Disaster Risk Intelligence & Community Early Action across all 30 Districts of Sindh"
    p3.font.size = Pt(18)
    p3.font.color.rgb = SKY_BLUE

    p4 = tf1.add_paragraph()
    p4.text = "\nStack: MERN (React + Vite + Tailwind + Express + MongoDB) | Open-Meteo & GloFAS Hydrology\nLanguages: English, Urdu (اردو), Sindhi (سنڌي) with Dynamic RTL"
    p4.font.size = Pt(14)
    p4.font.color.rgb = RGBColor(203, 213, 225)

    # -------------------------------------------------------------
    # SLIDE 2: THE PROBLEM IN SINDH
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "1. The Challenge: Climate Extremes in Sindh", "Why Sindh is ground-zero for dual-hazard climate vulnerability in South Asia")

    points_s2 = [
        ("Devastating Floods", "The 2022 monsoon deluge submerged over 70% of Sindh, displacing millions. Riverine inundation along the Indus River basin and pluvial flooding in urban districts (Karachi, Badin, Dadu) require automated advance warning."),
        ("Deadly Heatwaves", "Jacobabad, Nawabshah, and Larkana regularly experience lethal summer temperatures exceeding 50°C. Coupled with high coastal humidity, extreme wet-bulb conditions threaten laborers and vulnerable populations."),
        ("The Critical Gap", "Current warnings are often published as static PDF bulletins in English. Rural communities lack real-time, district-specific, trilingual advisories in Urdu and Sindhi.")
    ]

    for idx, (title, desc) in enumerate(points_s2):
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + idx * 3.9), Inches(2.0), Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR
        
        tb = s2.shapes.add_textbox(Inches(1.0 + idx * 3.9), Inches(2.2), Inches(3.3), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE if idx != 1 else AMBER_GOLD
        
        p2 = tf.add_paragraph()
        p2.text = f"\n{desc}"
        p2.font.size = Pt(13)
        p2.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 3: SYSTEM ARCHITECTURE & FULL STACK
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "2. System Architecture & Tech Stack", "Modern, scalable MERN micro-architecture with zero API-key dependencies")

    arch_layers = [
        ("Frontend Tier", "React 18 + Vite + Tailwind CSS", "Ultra-fast, mobile-responsive dashboard with Leaflet interactive GIS mapping, dynamic RTL layout switching, and offline speech synthesis."),
        ("Telemetry & APIs", "Open-Meteo & GloFAS Hydrology", "Live global forecast (ECMWF) + River discharge estimates (GloFAS) queried automatically. No API keys or vendor lock-in required."),
        ("Backend Services", "Express.js + Node.js (Node 24)", "REST API with automated input sanitization, background node-cron caching scheduler, and historical disaster scenario simulator."),
        ("Persistence Layer", "MongoDB + Mongoose & In-Memory Fallback", "Cached telemetry and evaluated risk indices. Features an embedded high-availability failover so demos never crash even without a database daemon.")
    ]

    for idx, (layer, tech, detail) in enumerate(arch_layers):
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + idx * 2.95), Inches(2.0), Inches(2.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tb = s3.shapes.add_textbox(Inches(0.95 + idx * 2.95), Inches(2.2), Inches(2.5), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = layer
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE

        p2 = tf.add_paragraph()
        p2.text = tech
        p2.font.size = Pt(16)
        p2.font.bold = True
        p2.font.color.rgb = DARK_TEXT

        p3 = tf.add_paragraph()
        p3.text = f"\n{detail}"
        p3.font.size = Pt(12)
        p3.font.color.rgb = GRAY_TEXT

    # -------------------------------------------------------------
    # SLIDE 4: RISK SCORING ENGINE (THRESHOLDS)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "3. Scientific Risk-Scoring Engine", "Transparent, student-explainable mathematical formulas in server/services/riskScore.js")

    box_left = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.0), Inches(5.7), Inches(4.5))
    box_left.fill.solid()
    box_left.fill.fore_color.rgb = CARD_BG
    box_left.line.color.rgb = BORDER_COLOR

    tbl1 = s4.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.0))
    tfl = tbl1.text_frame
    tfl.word_wrap = True
    p = tfl.paragraphs[0]
    p.text = "🔥 Heatwave Risk Logic (Heat Index Driven)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = AMBER_GOLD

    heat_text = (
        "\n• Evaluates Apparent Temperature ('Feels-Like') + Ambient Temp"
        "\n• Low (0–25): Feels-like < 37°C (Comfortable baseline)"
        "\n• Moderate (26–55): 37°C – 41.9°C (Caution for outdoor laborers)"
        "\n• High (56–79): 42°C – 47.9°C (Severe heatwave warning)"
        "\n• Extreme (80–100): >= 48°C (Heatstroke emergency; Jacobabad record)"
        "\n• Wet-Bulb Penalty: +12 points if Humidity >= 65% & Temp >= 38°C"
    )
    p2 = tfl.add_paragraph()
    p2.text = heat_text
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_TEXT

    box_right = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.5))
    box_right.fill.solid()
    box_right.fill.fore_color.rgb = CARD_BG
    box_right.line.color.rgb = BORDER_COLOR

    tbl2 = s4.shapes.add_textbox(Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.0))
    tfr = tbl2.text_frame
    tfr.word_wrap = True
    p = tfr.paragraphs[0]
    p.text = "🌊 Flood Risk Logic (Pluvial + Riverine)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = SKY_BLUE

    flood_text = (
        "\n• Rainfall (Pluvial): <5mm (Low) | 5-25mm (Moderate waterlogging) | 25-65mm (High) | >65mm (Catastrophic deluge)"
        "\n• River Flow (GloFAS Indus): <1,200 m³/s (Safe) | 1,200–2,800 m³/s (Medium) | 2,800–4,500 m³/s (High flood) | >4,500 m³/s (Super flood)"
        "\n• Topographic Weighting: Riverine districts (Sukkur, Dadu, Larkana) use 55% river / 45% rain; coastal districts use 85% rain & tidal drain."
        "\n• Soil Saturation: +15 points if 7-day cumulative rainfall > 80 mm"
    )
    p3 = tfr.add_paragraph()
    p3.text = flood_text
    p3.font.size = Pt(13)
    p3.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 5: DATA INTEGRITY ("WHAT IF DATA IS WRONG?")
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "4. Data Integrity: 'What If The Data Is Wrong?'", "The 5-Layer Defense Architecture safeguarding life-critical decisions")

    defense_layers = [
        ("1. Physical Bounds Sanitizer", "Rejects impossible readings: Temperature clamped [5°C to 55°C]; negative rainfall or negative river discharge automatically sanitized."),
        ("2. Multi-Parameter Triangulation", "A single faulty sensor cannot trigger a false catastrophe. Heatwave combines temp + humidity; flood combines rain + river discharge."),
        ("3. High-Availability Fallback", "Live Open-Meteo -> Cached Historical MongoDB State -> Climatological Regional Baselines. Server never crashes."),
        ("4. Data Confidence Auditing", "Every district calculates a real-time Confidence Score (98% Live, 82% Sanitized, 75% Fallback) displayed directly on the UI."),
        ("5. Ground-Truth Calibration", "Architecture allows PDMA and Sindh Irrigation Department manual barrage gauge readings to override satellite estimates.")
    ]

    for idx, (title, desc) in enumerate(defense_layers):
        row_y = 1.9 + idx * 1.0
        bar = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(row_y), Inches(11.7), Inches(0.85))
        bar.fill.solid()
        bar.fill.fore_color.rgb = CARD_BG
        bar.line.color.rgb = BORDER_COLOR

        tb = s5.shapes.add_textbox(Inches(1.0), Inches(row_y + 0.05), Inches(11.3), Inches(0.75))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"{title}:  "
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE

        run = p.add_run()
        run.text = desc
        run.font.bold = False
        run.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 6: TRILINGUAL & RTL INCLUSIVITY
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "5. Trilingual Accessibility & RTL Typography", "Equitable emergency communication in English, Urdu, and Sindhi")

    languages = [
        ("English (LTR)", "International & Technical", "Standard English interface with meteorological data, coordinates, and scientific summaries for district coordinators and academic judges."),
        ("اردو (RTL)", "National Language Reach", "Complete Urdu dictionary with dynamic dir='rtl' attribute injection and Noto Nastaliq Urdu typography. Clear advisories for citizens."),
        ("سنڌي (RTL)", "Sindh Provincial Inclusivity", "Native Sindhi terminology (سنڌ اسٽريم، ٻوڏ، سخت لُڪ، سنڌو درياهه جو وهڪرو) formatted in Noto Sans Arabic script for local communities.")
    ]

    for idx, (lang, sub, body) in enumerate(languages):
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + idx * 3.9), Inches(2.0), Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tb = s6.shapes.add_textbox(Inches(1.0 + idx * 3.9), Inches(2.2), Inches(3.3), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = lang
        p.font.size = Pt(20)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(13)
        p2.font.color.rgb = GRAY_TEXT

        p3 = tf.add_paragraph()
        p3.text = f"\n{body}"
        p3.font.size = Pt(13)
        p3.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 7: COMMUNITY ACTION & ACCESSIBILITY
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "6. Community Action & Rural Outreach", "Bridging the last-mile gap between high-tech telemetry and vulnerable villagers")

    features = [
        ("📲 1-Click WhatsApp Broadcast", "Villagers and Union Council elders can share pre-formatted, localized emergency warnings directly into community WhatsApp groups with 1 tap."),
        ("🔊 Text-to-Speech Audio Alerts", "Farmers who cannot read written text can click 'Listen / ٻڌو / سنیں' to hear safety instructions spoken aloud in their preferred language."),
        ("📄 Printable SitRep for Officials", "Generates single-page formal Situation Reports (SitReps) for District Commissioners (DC) and PDMA Sindh officers with 1 click."),
        ("📞 Direct Helplines Integration", "Embedded click-to-call links for PDMA Sindh 24/7 (1736), Rescue 1122, Edhi (115), and Chhipa (1020).")
    ]

    for idx, (feat, detail) in enumerate(features):
        x = 0.8 + (idx % 2) * 5.9
        y = 2.0 + (idx // 2) * 2.3
        box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(5.6), Inches(2.0))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = BORDER_COLOR

        tb = s7.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.2), Inches(5.2), Inches(1.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = feat
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE

        p2 = tf.add_paragraph()
        p2.text = f"\n{detail}"
        p2.font.size = Pt(13)
        p2.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 8: JUDGE DEMO SCENARIO SIMULATOR
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "7. Judge Demo: Disaster Scenario Simulator", "Overcoming the mild weather limitation by demonstrating live stress testing")

    scenarios = [
        ("🟢 Live Real-Time", "Real-Time Telemetry", "Queries live Open-Meteo & GloFAS API for all 30 districts right now."),
        ("🌊 2022 Super Flood", "Historical Indus Deluge", "Simulates Sukkur & Kotri discharge surging to 5,400 m³/s, turning Dadu, Larkana, and Badin RED/EXTREME."),
        ("🔥 51°C Summer Heatwave", "Jacobabad / Nawabshah Crisis", "Simulates peak summer heat with feels-like 53.5°C, triggering heatstroke alerts."),
        ("🌀 Arabian Sea Cyclone", "Coastal Surge & Inundation", "Simulates Category-3 tropical cyclone storm surge in Karachi, Thatta, and Badin.")
    ]

    for idx, (sc_name, sub, desc) in enumerate(scenarios):
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + idx * 2.95), Inches(2.0), Inches(2.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tb = s8.shapes.add_textbox(Inches(0.95 + idx * 2.95), Inches(2.2), Inches(2.5), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = sc_name
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE if idx != 2 else AMBER_GOLD

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = GRAY_TEXT

        p3 = tf.add_paragraph()
        p3.text = f"\n{desc}"
        p3.font.size = Pt(12)
        p3.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 9: DEPLOYMENT & PRODUCTION READINESS
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "8. Deployment & Cloud Architecture", "Ready for local student laptops and 24/7 cloud production")

    dep_points = [
        ("Local Development", "1-Command Startup (`npm run dev`) launches Express on 5050 and Vite on 5173. Built-in in-memory Mongo cache means zero complex DB setup required for judges."),
        ("Cloud Frontend", "Deployable on Vercel / Netlify with 1-click CI/CD. Native single-page routing and Tailwind CSS production bundles."),
        ("Cloud Backend", "Deployable on Render / Railway / AWS. Environment variables configured via .env without hardcoded credentials."),
        ("Database Hosting", "MongoDB Atlas free tier cluster automatically connected via standard MONGODB_URI connection string.")
    ]

    for idx, (head, body) in enumerate(dep_points):
        x = 0.8 + (idx % 2) * 5.9
        y = 2.0 + (idx // 2) * 2.3
        box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(5.6), Inches(2.0))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = BORDER_COLOR

        tb = s9.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.2), Inches(5.2), Inches(1.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = SKY_BLUE

        p2 = tf.add_paragraph()
        p2.text = f"\n{body}"
        p2.font.size = Pt(13)
        p2.font.color.rgb = DARK_TEXT

    # -------------------------------------------------------------
    # SLIDE 10: CONCLUSION & IMPACT
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = PRIMARY_DARK
    bg10.line.color.rgb = PRIMARY_DARK

    tbox10 = s10.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(4.5))
    tf10 = tbox10.text_frame
    tf10.word_wrap = True

    p = tf10.paragraphs[0]
    p.text = "Sindh STREAM 2026-27"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = AMBER_GOLD

    p2 = tf10.add_paragraph()
    p2.text = "Thank You! Ready for Live Demonstration & Questions."
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

    p3 = tf10.add_paragraph()
    p3.text = "\nKey Takeaways:"
    p3.font.size = Pt(16)
    p3.font.bold = True
    p3.font.color.rgb = SKY_BLUE

    summary_text = (
        "1. Complete MERN full-stack disaster early warning system for all 30 districts of Sindh.\n"
        "2. Scientific multi-hazard risk engine combining heat index, pluvial rainfall, and GloFAS river discharge.\n"
        "3. 5-Layer data integrity architecture answering 'What if data is wrong?'.\n"
        "4. Community-first inclusivity: English, Urdu, Sindhi with dynamic RTL, WhatsApp broadcast & audio voice alerts."
    )
    p4 = tf10.add_paragraph()
    p4.text = summary_text
    p4.font.size = Pt(14)
    p4.font.color.rgb = RGBColor(203, 213, 225)

    # Save presentation
    output_path = "C:/Users/Amaar Ahmed/.gemini/antigravity/scratch/sindh-stream-warning/Sindh_STREAM_2026-27_Early_Warning_System.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
