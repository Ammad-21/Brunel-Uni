from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, Preformatted
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import datetime

OUTPUT = "/Users/muhammadammaduddin/Brunel-Uni/EcoMove_Chat_History.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
    title="EcoMove – Full Chat History",
    author="Muhammad Amad Uddin"
)

W = A4[0] - 4*cm  # usable width

# ── Styles ──────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

DARK_BLUE   = colors.HexColor("#1a3a5c")
MID_BLUE    = colors.HexColor("#2563eb")
LIGHT_BLUE  = colors.HexColor("#dbeafe")
USER_BG     = colors.HexColor("#f0f9ff")
AI_BG       = colors.HexColor("#f8fafc")
CODE_BG     = colors.HexColor("#1e293b")
CODE_FG     = colors.HexColor("#e2e8f0")
BORDER      = colors.HexColor("#cbd5e1")
GREEN       = colors.HexColor("#166534")
GREEN_BG    = colors.HexColor("#dcfce7")
ORANGE      = colors.HexColor("#92400e")
ORANGE_BG   = colors.HexColor("#fef3c7")

title_style = ParagraphStyle("Title", parent=styles["Title"],
    textColor=DARK_BLUE, fontSize=22, spaceAfter=6, alignment=TA_CENTER)

subtitle_style = ParagraphStyle("Subtitle", parent=styles["Normal"],
    textColor=MID_BLUE, fontSize=11, spaceAfter=4, alignment=TA_CENTER)

meta_style = ParagraphStyle("Meta", parent=styles["Normal"],
    textColor=colors.grey, fontSize=9, spaceAfter=2, alignment=TA_CENTER)

section_style = ParagraphStyle("Section", parent=styles["Heading1"],
    textColor=DARK_BLUE, fontSize=14, spaceBefore=18, spaceAfter=6,
    borderPad=4, leading=18)

h2_style = ParagraphStyle("H2", parent=styles["Heading2"],
    textColor=DARK_BLUE, fontSize=12, spaceBefore=12, spaceAfter=4)

h3_style = ParagraphStyle("H3", parent=styles["Heading3"],
    textColor=MID_BLUE, fontSize=11, spaceBefore=8, spaceAfter=3)

body_style = ParagraphStyle("Body", parent=styles["Normal"],
    fontSize=10, leading=15, spaceAfter=4, textColor=colors.HexColor("#1e293b"))

user_label = ParagraphStyle("UserLabel", parent=styles["Normal"],
    fontSize=9, textColor=MID_BLUE, spaceBefore=10, spaceAfter=2,
    fontName="Helvetica-Bold")

ai_label = ParagraphStyle("AILabel", parent=styles["Normal"],
    fontSize=9, textColor=DARK_BLUE, spaceBefore=10, spaceAfter=2,
    fontName="Helvetica-Bold")

bullet_style = ParagraphStyle("Bullet", parent=body_style,
    leftIndent=16, firstLineIndent=-10, spaceAfter=3,
    bulletText="•")

direction_style = ParagraphStyle("Direction", parent=styles["Normal"],
    fontSize=10, leading=14, textColor=colors.HexColor("#374151"),
    leftIndent=12, spaceAfter=3, fontName="Helvetica-Oblique")

speech_style = ParagraphStyle("Speech", parent=styles["Normal"],
    fontSize=10, leading=15, textColor=colors.HexColor("#111827"),
    leftIndent=12, spaceAfter=4)

code_style = ParagraphStyle("Code", parent=styles["Code"],
    fontSize=8.5, leading=13, textColor=CODE_FG,
    backColor=CODE_BG, leftIndent=8, rightIndent=8,
    borderPad=6, fontName="Courier")

note_style = ParagraphStyle("Note", parent=styles["Normal"],
    fontSize=9, textColor=ORANGE, leftIndent=12, spaceAfter=3,
    fontName="Helvetica-Oblique")

# ── Helpers ─────────────────────────────────────────────────────────────────

def hr(): return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=6, spaceBefore=6)

def sp(n=6): return Spacer(1, n)

def heading1(text): return Paragraph(text, section_style)
def heading2(text): return Paragraph(text, h2_style)
def heading3(text): return Paragraph(text, h3_style)
def body(text):     return Paragraph(text, body_style)
def bullet(text):   return Paragraph(f"• {text}", bullet_style)
def direction(text):return Paragraph(text, direction_style)
def speech(text):   return Paragraph(text, speech_style)
def note(text):     return Paragraph(f"Note: {text}", note_style)

def user_bubble(text):
    return [
        Paragraph("👤  USER", user_label),
        Table([[Paragraph(text, body_style)]],
              colWidths=[W],
              style=TableStyle([
                  ("BACKGROUND", (0,0), (-1,-1), USER_BG),
                  ("BOX",        (0,0), (-1,-1), 0.5, MID_BLUE),
                  ("LEFTPADDING",(0,0),(-1,-1), 10),
                  ("RIGHTPADDING",(0,0),(-1,-1),10),
                  ("TOPPADDING", (0,0),(-1,-1), 8),
                  ("BOTTOMPADDING",(0,0),(-1,-1), 8),
                  ("ROUNDEDCORNERS",[4]),
              ])),
        sp(4),
    ]

def ai_bubble(text):
    return [
        Paragraph("🤖  CLAUDE (AI ASSISTANT)", ai_label),
        Table([[Paragraph(text, body_style)]],
              colWidths=[W],
              style=TableStyle([
                  ("BACKGROUND", (0,0), (-1,-1), AI_BG),
                  ("BOX",        (0,0), (-1,-1), 0.5, BORDER),
                  ("LEFTPADDING",(0,0),(-1,-1), 10),
                  ("RIGHTPADDING",(0,0),(-1,-1),10),
                  ("TOPPADDING", (0,0),(-1,-1), 8),
                  ("BOTTOMPADDING",(0,0),(-1,-1), 8),
              ])),
        sp(4),
    ]

def code_block(lines):
    text = "\n".join(lines)
    return [
        Table([[Preformatted(text, code_style)]],
              colWidths=[W],
              style=TableStyle([
                  ("BACKGROUND", (0,0),(-1,-1), CODE_BG),
                  ("BOX",        (0,0),(-1,-1), 0.5, colors.HexColor("#334155")),
                  ("LEFTPADDING",(0,0),(-1,-1), 8),
                  ("RIGHTPADDING",(0,0),(-1,-1), 8),
                  ("TOPPADDING", (0,0),(-1,-1), 6),
                  ("BOTTOMPADDING",(0,0),(-1,-1), 6),
              ])),
        sp(6),
    ]

def info_box(text, bg=GREEN_BG, tc=GREEN):
    s = ParagraphStyle("IB", parent=body_style, textColor=tc)
    return [
        Table([[Paragraph(text, s)]],
              colWidths=[W],
              style=TableStyle([
                  ("BACKGROUND",(0,0),(-1,-1), bg),
                  ("BOX",       (0,0),(-1,-1), 0.5, tc),
                  ("LEFTPADDING",(0,0),(-1,-1),10),
                  ("RIGHTPADDING",(0,0),(-1,-1),10),
                  ("TOPPADDING",(0,0),(-1,-1),6),
                  ("BOTTOMPADDING",(0,0),(-1,-1),6),
              ])),
        sp(6),
    ]

def api_table(rows):
    header = [Paragraph(h, ParagraphStyle("TH", parent=styles["Normal"],
        fontSize=9, fontName="Helvetica-Bold", textColor=colors.white))
        for h in ["#","Method","URL","Body"]]
    data = [header]
    for r in rows:
        data.append([Paragraph(str(r[0]), body_style),
                     Paragraph(r[1], body_style),
                     Paragraph(f'<font name="Courier" size="8">{r[2]}</font>', body_style),
                     Paragraph(r[3], body_style)])
    t = Table(data, colWidths=[0.6*cm, 1.6*cm, 9.5*cm, 2.5*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), DARK_BLUE),
        ("TEXTCOLOR", (0,0),(-1,0), colors.white),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, LIGHT_BLUE]),
        ("BOX",(0,0),(-1,-1),0.5,BORDER),
        ("INNERGRID",(0,0),(-1,-1),0.3,BORDER),
        ("LEFTPADDING",(0,0),(-1,-1),5),
        ("RIGHTPADDING",(0,0),(-1,-1),5),
        ("TOPPADDING",(0,0),(-1,-1),4),
        ("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    return [t, sp(8)]

def db_table(rows):
    header = [Paragraph(h, ParagraphStyle("TH", parent=styles["Normal"],
        fontSize=9, fontName="Helvetica-Bold", textColor=colors.white))
        for h in rows[0]]
    data = [header] + [[Paragraph(str(c), body_style) for c in r] for r in rows[1:]]
    col_w = W / len(rows[0])
    t = Table(data, colWidths=[col_w]*len(rows[0]))
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), DARK_BLUE),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, LIGHT_BLUE]),
        ("BOX",(0,0),(-1,-1),0.5,BORDER),
        ("INNERGRID",(0,0),(-1,-1),0.3,BORDER),
        ("LEFTPADDING",(0,0),(-1,-1),5),
        ("RIGHTPADDING",(0,0),(-1,-1),5),
        ("TOPPADDING",(0,0),(-1,-1),4),
        ("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    return [t, sp(8)]

def timing_table(rows):
    header = [Paragraph(h, ParagraphStyle("TH", parent=styles["Normal"],
        fontSize=9, fontName="Helvetica-Bold", textColor=colors.white))
        for h in ["Section","Duration"]]
    data = [header] + [[Paragraph(r[0], body_style), Paragraph(r[1], body_style)] for r in rows]
    t = Table(data, colWidths=[W*0.75, W*0.25])
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0), DARK_BLUE),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, LIGHT_BLUE]),
        ("BOX",(0,0),(-1,-1),0.5,BORDER),
        ("INNERGRID",(0,0),(-1,-1),0.3,BORDER),
        ("LEFTPADDING",(0,0),(-1,-1),6),
        ("RIGHTPADDING",(0,0),(-1,-1),6),
        ("TOPPADDING",(0,0),(-1,-1),4),
        ("BOTTOMPADDING",(0,0),(-1,-1),4),
    ]))
    return [t, sp(8)]

# ═══════════════════════════════════════════════════════════════════════════
# BUILD CONTENT
# ═══════════════════════════════════════════════════════════════════════════
story = []

# ── Cover Page ──────────────────────────────────────────────────────────────
story += [
    sp(40),
    Paragraph("EcoMove Backend", title_style),
    Paragraph("Full Chat History & Demo Video Script", subtitle_style),
    sp(8),
    Paragraph("CS2701 Level 5 Group Project — Group A2", meta_style),
    Paragraph(f"Generated: {datetime.datetime.now().strftime('%d %B %Y')}", meta_style),
    sp(6),
    hr(),
    sp(4),
    Paragraph("Muhammad Amad Uddin", meta_style),
    Paragraph("Brunel University London", meta_style),
    sp(60),
]

# ── Table of Contents ───────────────────────────────────────────────────────
story += [
    hr(),
    heading1("Table of Contents"),
    hr(),
    body("1.  Database Check — PostgreSQL &amp; PgAdmin Setup"),
    body("2.  Demo Video Script (First Version — Structured Outline)"),
    body("3.  Demo Video Script (Final Version — Full Speech Script)"),
    body("    3a.  Before You Press Record"),
    body("    3b.  Section 1 — Introduction"),
    body("    3c.  Section 2 — Spring Boot Application Structure"),
    body("    3d.  Section 3 — Physical Data Model in PgAdmin"),
    body("    3e.  Section 4 — Populated Database Data"),
    body("    3f.  Section 5 — Thunder Client API Demonstration"),
    body("    3g.  Section 6 — Key Technical Details"),
    body("    3h.  Section 7 — Closing"),
    body("    3i.  Quick Reference — API Calls in Order"),
    sp(10),
]

# ═══════════════════════════════════════════════════════════════════════════
# CONVERSATION TURN 1 — DB CHECK
# ═══════════════════════════════════════════════════════════════════════════
story += [hr(), heading1("1.  Database Check — PostgreSQL & PgAdmin Setup"), hr(), sp(4)]

story += user_bubble(
    "Check if I have postgres database and I have PGadmin 4 in the computer "
    "so show me some data in the pgadmin"
)

story += ai_bubble(
    "PostgreSQL is running and your <b>ecomove</b> database has data. "
    "Here is a summary of what was found:"
)

story += [heading2("Database Details")]
story += info_box(
    "Database: ecomove  |  Host: localhost  |  Port: 5432  |  "
    "Username: postgres  |  Password: postgres",
    bg=LIGHT_BLUE, tc=DARK_BLUE
)

story += [heading2("Tables Found")]
story += db_table([
    ["Table","Records","Description"],
    ["users","4 users","Registered user accounts"],
    ["transport_types","5 types","Car, Bus, Train, Bike, Walking"],
    ["trips","5 trips","Logged journey records"],
])

story += [heading2("How to View Data in PgAdmin 4")]
for step in [
    "Open PgAdmin 4 from Applications.",
    "Right-click <b>Servers</b> → <b>Register</b> → <b>Server</b>.",
    "Under the <b>General</b> tab, set Name: <b>EcoMove</b>.",
    "Under the <b>Connection</b> tab, set Host: <b>localhost</b>, Port: <b>5432</b>, "
    "Database: <b>ecomove</b>, Username: <b>postgres</b>, Password: <b>postgres</b>.",
    "Click <b>Save</b>.",
    "Navigate to: Servers → EcoMove → Databases → ecomove → Schemas → public → Tables.",
    "Right-click any table → <b>View/Edit Data → All Rows</b> to see the data.",
]:
    story.append(bullet(step))

story += [sp(6)]
story += info_box(
    "⚠  Security note: test@example.com has a plain-text password (123456). "
    "This should be hashed if the project moves beyond development.",
    bg=ORANGE_BG, tc=ORANGE
)

# ═══════════════════════════════════════════════════════════════════════════
# CONVERSATION TURN 2 — FIRST SCRIPT REQUEST
# ═══════════════════════════════════════════════════════════════════════════
story += [sp(10), hr(), heading1("2.  Demo Video Script — First Version (Structured Outline)"), hr(), sp(4)]

story += user_bubble(
    "So now I have to demonstrate a video explaining all the work done. "
    "Can you write a script to demonstrate just the back end if I upload the template to you."
)
story += user_bubble(
    "[University template uploaded — CS2701 Deliverable 4: Individual Demo Video. "
    "Requirements: show Spring Boot structure, physical data model, populated database, "
    "and API calls using Thunder Client. Duration ≤ 10 minutes. Face must be visible.]"
)

story += ai_bubble(
    "Here is the full demo video script structured to the university requirements:"
)

story += [heading2("Thunder Client Requests — Quick Reference")]
story += api_table([
    [1,"GET",  "http://localhost:8080/api/health/status",    "None"],
    [2,"GET",  "http://localhost:8080/api/health/db",        "None"],
    [3,"GET",  "http://localhost:8080/api/transport-types",  "None"],
    [4,"POST", "http://localhost:8080/api/trips",            "JSON body"],
    [5,"GET",  "http://localhost:8080/api/users/1/stats",    "None"],
    [6,"GET",  "http://localhost:8080/api/leaderboard",      "None"],
    [7,"GET",  "http://localhost:8080/api/stats/summary",    "None"],
])

story += [heading2("Timing Guide — First Version")]
story += timing_table([
    ["Introduction",             "0:30"],
    ["Spring Boot Structure",    "1:30"],
    ["PgAdmin — Data Model",     "1:30"],
    ["PgAdmin — Populated Data", "1:00"],
    ["Thunder Client API Demo",  "3:00"],
    ["Technical Highlights",     "1:00"],
    ["Outro",                    "0:30"],
    ["Total",                    "~9:00"],
])

# ═══════════════════════════════════════════════════════════════════════════
# CONVERSATION TURN 3 — FULL SPEECH SCRIPT
# ═══════════════════════════════════════════════════════════════════════════
story += [sp(10), hr(), heading1("3.  Demo Video Script — Final Version (Full Speech Script)"), hr(), sp(4)]

story += user_bubble(
    "No — like a speech script with detailed instructions directed from one component to another."
)
story += user_bubble(
    "Make it a bit more clearer as this is a bit more messy. "
    "The text should be clearer and they should also show all the necessary steps."
)

story += ai_bubble(
    "Here is the full word-for-word speech script with clear stage directions at every step:"
)

# ── Before Recording ────────────────────────────────────────────────────────
story += [heading2("BEFORE YOU PRESS RECORD")]
story += info_box(
    "Complete ALL of these steps before starting the screen recorder.",
    bg=ORANGE_BG, tc=ORANGE
)
for s in [
    "Open VS Code with the <b>Brunel-Uni/backend</b> project.",
    "Run the backend — open the terminal in VS Code and run <b>mvn spring-boot:run</b>. "
    "Wait until you see <i>Started EcoMoveApplication</i> in the terminal.",
    "Open PgAdmin 4 and connect to the <b>ecomove</b> database.",
    "Open Thunder Client in VS Code (left sidebar icon).",
    "Make sure your face is visible in the corner of the recording.",
]:
    story.append(bullet(s))

story += [sp(8)]

# ── Section 1 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 1 — INTRODUCTION"), sp(2)]
story += info_box("Duration: ~30 seconds  |  Camera on your face", bg=LIGHT_BLUE, tc=DARK_BLUE)
story.append(direction("► Look directly at the camera and say:"))
story.append(sp(3))

for line in [
    '"Hi, my name is Muhammad Amad Uddin. This is my individual backend demo for the EcoMove application.',
    'EcoMove is a carbon footprint tracker. Users log their journeys — for example, a 10 kilometre bus trip — '
    'and the system automatically calculates how much CO2 they emitted and how much CO2 they saved compared to '
    'making that same journey by car.',
    'In this demo I will cover four things:',
]:
    story.append(speech(line))

for b in [
    "The Spring Boot application structure",
    "The database tables in PgAdmin",
    "The populated data",
    "And live API calls using Thunder Client",
]:
    story.append(bullet(b))

story.append(speech('"Let me share my screen now."'))
story.append(direction("► Start screen share — show VS Code"))

story += [sp(8)]

# ── Section 2 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 2 — SPRING BOOT APPLICATION STRUCTURE"), sp(2)]
story += info_box("Duration: ~2 minutes  |  Show VS Code Explorer", bg=LIGHT_BLUE, tc=DARK_BLUE)

story.append(direction(
    "► In VS Code, click the Explorer icon on the left sidebar. Navigate to and expand:\n"
    "   backend/src/main/java/com/ecomove/backend/"
))
story.append(speech(
    '"Here is the structure of my Spring Boot application. It follows the standard layered '
    'architecture with four main packages."'
))

for step_num, (folder, files, desc) in enumerate([
    ("model/", "User.java, Trip.java, TransportType.java",
     "This contains three JPA entity classes — User, Trip, and TransportType. Each class maps directly "
     "to a table in the PostgreSQL database. Hibernate reads these classes and automatically creates the "
     "table structure from them."),
    ("repository/", "UserRepository.java, TripRepository.java, TransportTypeRepository.java",
     "These are Spring Data JPA interfaces — one for each entity. They handle all database operations "
     "such as saving, finding, and deleting records. Inside TripRepository I have also written custom "
     "JPQL queries for more complex operations like calculating leaderboard rankings and aggregating "
     "statistics per user."),
    ("service/", "TripService.java, UserService.java, AuthService.java, StatsService.java, LeaderboardService.java, TransportTypeInitializer.java",
     "This is where all the business logic lives. For example, TripService calculates the CO2 emitted "
     "and CO2 saved for every trip. StatsService aggregates platform-wide totals. And "
     "TransportTypeInitializer runs automatically on startup to seed the database with the five transport types."),
    ("controller/", "TripController.java, UserController.java, AuthController.java, StatsController.java, LeaderboardController.java, TransportTypeController.java, HealthController.java, HealthApiController.java",
     "These are the REST controllers that expose the API endpoints. Each controller maps incoming HTTP "
     "requests to the correct service method. I have controllers for trips, users, authentication, "
     "transport types, leaderboard, stats, and health checks."),
    ("dto/", "LeaderboardDTO.java, UserStatsDTO.java, SummaryStatsDTO.java",
     "DTO stands for Data Transfer Object. I use these to control exactly what gets returned in each "
     "API response, keeping the internal database models separate from what the client receives."),
], 1):
    story.append(heading3(f"Step {step_num} — {folder}"))
    story.append(direction(f"► Click to expand the {folder} folder. You should see: {files}"))
    story.append(speech(f'"{desc}"'))
    story.append(sp(4))

story.append(speech(
    '"So the full request flow is: a request hits a Controller, the Controller calls a Service, '
    'the Service uses a Repository to read or write the database, and the result travels back up '
    'and is returned as a JSON response."'
))

story += [sp(8)]

# ── Section 3 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 3 — PHYSICAL DATA MODEL IN PGADMIN"), sp(2)]
story += info_box("Duration: ~2 minutes  |  Switch to PgAdmin 4", bg=LIGHT_BLUE, tc=DARK_BLUE)

story.append(direction("► Switch to PgAdmin 4"))
story.append(speech(
    '"Now let me show the physical database structure in PgAdmin. I am connected to the '
    '<b>ecomove</b> PostgreSQL database running on localhost port 5432."'
))

story.append(heading3("Step 1 — Navigate to the tables"))
story.append(direction(
    "► In the left panel expand in this order:\n"
    "   Servers → EcoMove → Databases → ecomove → Schemas → public → Tables"
))
story.append(speech(
    '"You can see there are three tables — users, transport_types, and trips. Let me go through each one."'
))

story.append(heading3("Step 2 — Show the users table structure"))
story.append(direction("► Click on 'users' in the left panel, then expand 'Columns' underneath it"))
story.append(speech(
    '"The users table has four columns. <b>id</b> is the primary key, auto-incremented. '
    '<b>name</b> stores the user\'s display name. <b>email</b> has a unique constraint — '
    'no two accounts can share the same email address. And <b>password</b> stores the BCrypt-hashed password."'
))

story.append(heading3("Step 3 — Show the transport_types table structure"))
story.append(direction("► Click on 'transport_types' in the left panel, then expand 'Columns' underneath it"))
story.append(speech(
    '"The transport_types table has three columns. <b>id</b> is the primary key. <b>name</b> is the '
    'transport mode — Car, Bus, Train, Bike, or Walking. And <b>co2_per_km</b> is the most important '
    'field in the application. It stores how many kilograms of CO2 that transport mode emits per kilometre. '
    'This single value drives every carbon calculation in the system."'
))

story.append(heading3("Step 4 — Show the trips table structure"))
story.append(direction("► Click on 'trips' in the left panel, then expand 'Columns' underneath it"))
story.append(speech(
    '"The trips table has seven columns. <b>id</b> is the primary key. <b>user_id</b> is a foreign key '
    'linking to the users table. <b>transport_type_id</b> is a foreign key linking to the transport_types '
    'table. <b>distance_km</b> is how far the trip was. <b>co2_emitted</b> is the actual carbon emissions '
    'for that trip. <b>co2_saved</b> is how much CO2 was saved compared to making the same journey by car. '
    'And <b>trip_date</b> is automatically recorded when the trip is created."'
))

story += [sp(8)]

# ── Section 4 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 4 — POPULATED DATABASE DATA"), sp(2)]
story += info_box("Duration: ~1 minute  |  Stay in PgAdmin 4", bg=LIGHT_BLUE, tc=DARK_BLUE)

story.append(heading3("Step 1 — Show transport_types data"))
story.append(direction("► Right-click on 'transport_types' → View/Edit Data → All Rows"))
story.append(speech(
    '"Here is the populated data in the transport_types table. Car emits 0.192 kg CO2 per km, '
    'Bus emits 0.105, Train emits 0.041, and Bike and Walking emit zero because they produce no carbon. '
    'These five rows are seeded automatically by the application every time it starts up."'
))

story.append(heading3("Step 2 — Show users data"))
story.append(direction("► Right-click on 'users' → View/Edit Data → All Rows"))
story.append(speech(
    '"And here are the registered users in the system. You can see several test accounts with '
    'hashed passwords stored in the database."'
))

story.append(heading3("Step 3 — Show trips data"))
story.append(direction("► Right-click on 'trips' → View/Edit Data → All Rows"))
story.append(speech(
    '"And here are the logged trips. Notice that <b>co2_emitted</b> and <b>co2_saved</b> are already '
    'calculated and stored for each row. For example, this 10 km bus trip shows 1.05 kg emitted and '
    '0.87 kg saved — because choosing the bus instead of a car for 10 km avoids that much CO2."'
))
story += info_box(
    "Keep this trips table visible on screen. After the next API call you will see a brand new "
    "row appear here in real time.",
    bg=ORANGE_BG, tc=ORANGE
)

story += [sp(8)]

# ── Section 5 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 5 — THUNDER CLIENT API DEMONSTRATION"), sp(2)]
story += info_box("Duration: ~3 minutes  |  Switch to VS Code → Thunder Client", bg=LIGHT_BLUE, tc=DARK_BLUE)

story.append(direction("► Switch to VS Code and click the Thunder Client icon in the left sidebar"))
story.append(speech(
    '"Now I will use Thunder Client to demonstrate the REST API. The backend is running on '
    'localhost port 8080. I will show seven endpoints."'
))

calls = [
    ("API Call 1 — Health Check",
     "GET", "http://localhost:8080/api/health/status", None,
     '"First, a basic health check. The API returns <b>ok: true</b>, confirming the backend '
     'is running and reachable."'),
    ("API Call 2 — Database Health Check",
     "GET", "http://localhost:8080/api/health/db", None,
     '"This endpoint verifies the database connection. It returns the database product name '
     'confirming we are connected to PostgreSQL."'),
    ("API Call 3 — Get All Transport Types",
     "GET", "http://localhost:8080/api/transport-types", None,
     '"This returns all five transport types from the database — their names and CO2 per km values. '
     'The frontend uses this response to populate the transport selection when a user logs a trip."'),
    ("API Call 4 — Log a New Trip  ★ Most Important",
     "POST", "http://localhost:8080/api/trips",
     '{\n  "userId": 1,\n  "transportTypeId": 3,\n  "distanceKm": 15\n}',
     None),
    ("API Call 5 — User Statistics",
     "GET", "http://localhost:8080/api/users/1/stats", None,
     '"This endpoint returns aggregated statistics for user 1 — total trips, total distance, '
     'total CO2 emitted across all their trips, and total CO2 saved. This is powered by a custom '
     'JPQL aggregate query in TripRepository that sums all the user\'s trip data in a single '
     'database query."'),
    ("API Call 6 — Leaderboard",
     "GET", "http://localhost:8080/api/leaderboard", None,
     '"The leaderboard ranks every user by their total CO2 saved. Users who consistently choose '
     'eco-friendly transport appear higher. This is a custom query that groups trips by user, '
     'sums the CO2 saved column, and orders the results from highest to lowest."'),
    ("API Call 7 — Summary Statistics",
     "GET", "http://localhost:8080/api/stats/summary", None,
     '"Finally, the summary statistics endpoint. This returns platform-wide data — total trips '
     'logged by all users, total CO2 saved across the whole platform, number of active users, '
     'how many low-carbon trips were logged today, and the top three leaderboard entries. '
     'This is what a dashboard view would consume."'),
]

for title, method, url, body_json, script_line in calls:
    story.append(heading3(title))
    story.append(direction(f"► Create a new request:"))
    story.append(direction(f"   Method: {method}"))
    story.append(direction(f"   URL: {url}"))
    if body_json:
        story.append(direction("   Click the Body tab → select JSON → paste this:"))
        story += code_block(body_json.split("\n"))
        story.append(direction("   Click Send — pause and look at the response"))
        story.append(speech(
            '"This is the most important endpoint — logging a trip. I am sending a 15 kilometre '
            'train journey for user 1. Transport type 3 is the train. Let me send this now."'
        ))
        story.append(sp(3))
        story.append(speech(
            '"Look at the response. <b>co2Emitted</b> is 0.615 — that is 15 km multiplied by the '
            "train's rate of 0.041 kg per km. <b>co2Saved</b> is 2.265 — that is because a car would "
            'have produced 2.88 kg for the same 15 km journey. By choosing the train, the user saved '
            '2.265 kg of CO2. The trip date was recorded automatically. Status 200 OK."'
        ))
        story.append(sp(3))
        story.append(direction("► Switch to PgAdmin — the trips table should still be open from Section 4"))
        story.append(direction("► Right-click the trips table → Refresh, or click View/Edit Data → All Rows again"))
        story.append(speech(
            '"And there is the new row at the bottom of the trips table — with exactly those values. '
            'This confirms the data was calculated in the service layer and correctly persisted to PostgreSQL."'
        ))
        story.append(direction("► Switch back to Thunder Client"))
    else:
        story.append(direction("   Click Send"))
        if script_line:
            story.append(sp(3))
            story.append(speech(script_line))
    story.append(sp(6))

story += [sp(8)]

# ── Section 6 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 6 — KEY TECHNICAL DETAILS"), sp(2)]
story += info_box("Duration: ~1 minute  |  Stay in VS Code", bg=LIGHT_BLUE, tc=DARK_BLUE)

for step, fname, fpath, script in [
    ("Step 1", "TripService.java", "service/TripService.java",
     '"The CO2 calculation logic is here in TripService. For every trip, the service multiplies '
     "the distance by the transport type's CO2 rate to get emissions. Then it calculates savings "
     'by comparing that figure against what a car would have emitted for the same distance. Car is '
     'always the baseline. If you walk or cycle, you save the full car emission amount."'),
    ("Step 2", "TripRepository.java", "repository/TripRepository.java",
     '"In TripRepository I have written a custom JPQL query that uses a projection interface to return '
     'aggregate results directly as a DTO. This is more efficient than loading every individual trip '
     'record into memory just to calculate totals."'),
    ("Step 3", "TransportTypeInitializer.java", "service/TransportTypeInitializer.java",
     '"This class implements CommandLineRunner, which means it executes once automatically when the '
     'application starts. It checks whether each transport type already exists in the database and '
     'either creates or updates it. This keeps the transport data consistent across all environments."'),
]:
    story.append(heading3(f"{step} — Open {fname}"))
    story.append(direction(f"► Navigate to and open: {fpath}"))
    story.append(sp(3))
    story.append(speech(script))
    story.append(sp(6))

story += [sp(8)]

# ── Section 7 ───────────────────────────────────────────────────────────────
story += [heading2("SECTION 7 — CLOSING"), sp(2)]
story += info_box("Duration: ~30 seconds  |  Face back on camera", bg=LIGHT_BLUE, tc=DARK_BLUE)

story.append(direction("► Look directly at the camera and say:"))
story.append(sp(4))
for line in [
    '"To summarise — I built the complete backend for EcoMove using Spring Boot 3 with a PostgreSQL database.',
    'The architecture follows a clean layered structure: controllers handle HTTP requests, services handle '
    'business logic, and repositories handle all database access.',
    'The core feature is the CO2 calculation engine that computes emissions and savings for every trip, '
    'aggregates user statistics, and powers a leaderboard to encourage greener travel choices.',
    'All data is persisted in PostgreSQL and accessible through a REST API.',
    'Thank you for watching."',
]:
    story.append(speech(line))

story += [sp(10)]

# ── Final Quick Reference ────────────────────────────────────────────────────
story += [hr(), heading2("QUICK REFERENCE — All API Calls In Order"), hr(), sp(4)]
story += api_table([
    [1,"GET",  "http://localhost:8080/api/health/status",   "No body"],
    [2,"GET",  "http://localhost:8080/api/health/db",       "No body"],
    [3,"GET",  "http://localhost:8080/api/transport-types", "No body"],
    [4,"POST", "http://localhost:8080/api/trips",           "JSON (see below)"],
    [5,"GET",  "http://localhost:8080/api/users/1/stats",   "No body"],
    [6,"GET",  "http://localhost:8080/api/leaderboard",     "No body"],
    [7,"GET",  "http://localhost:8080/api/stats/summary",   "No body"],
])

story += [heading3("JSON Body for API Call 4 (POST /api/trips)")]
story += code_block([
    '{',
    '  "userId": 1,',
    '  "transportTypeId": 3,',
    '  "distanceKm": 15',
    '}',
])

story += [heading2("Timing Guide — Final Version")]
story += timing_table([
    ["Section 1 — Introduction",                  "~0:30"],
    ["Section 2 — Spring Boot Structure",         "~2:00"],
    ["Section 3 — Physical Data Model in PgAdmin","~2:00"],
    ["Section 4 — Populated Database Data",       "~1:00"],
    ["Section 5 — Thunder Client API Demo",       "~3:00"],
    ["Section 6 — Key Technical Details",         "~1:00"],
    ["Section 7 — Closing",                       "~0:30"],
    ["Total",                                     "~10:00"],
])

# ── Footer note ──────────────────────────────────────────────────────────────
story += [
    hr(),
    Paragraph(
        "EcoMove Backend — CS2701 Level 5 Group Project, Group A2  |  "
        "Muhammad Amad Uddin  |  Brunel University London",
        meta_style
    ),
    sp(4),
]

# ── Build ────────────────────────────────────────────────────────────────────
doc.build(story)
print(f"PDF saved to: {OUTPUT}")
