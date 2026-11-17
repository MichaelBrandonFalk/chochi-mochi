"""Regenerate the printable notes from docs/RESEARCH.md (requires ReportLab)."""
from pathlib import Path
import re, shutil
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter

root=Path(__file__).resolve().parent.parent
output=root/'output/pdf/chochi-mochi-curriculum-notes.pdf'
output.parent.mkdir(parents=True,exist_ok=True)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='NotesTitle',fontName='Times-Roman',fontSize=24,leading=28,spaceAfter=13))
styles.add(ParagraphStyle(name='NotesBody',fontName='Times-Roman',fontSize=11,leading=15,spaceAfter=8,allowWidows=0,allowOrphans=0))
styles.add(ParagraphStyle(name='NotesH2',parent=styles['NotesBody'],fontName='Times-Bold',fontSize=15,leading=19,spaceBefore=16,spaceAfter=8,keepWithNext=True))
styles.add(ParagraphStyle(name='NotesH3',parent=styles['NotesBody'],fontName='Times-Bold',fontSize=12,leading=16,spaceBefore=12,spaceAfter=6,keepWithNext=True))
styles.add(ParagraphStyle(name='NotesSmall',parent=styles['NotesBody'],fontName='Helvetica',fontSize=8,leading=11,spaceAfter=9))
styles.add(ParagraphStyle(name='NotesCell',parent=styles['NotesBody'],fontSize=10,leading=13,spaceAfter=0))
styles.add(ParagraphStyle(name='NotesCellHead',parent=styles['NotesCell'],fontName='Helvetica-Bold',fontSize=9,leading=12))

def inline(text):
    text=escape(text.replace('\u2013','-').replace('\u2014','-').replace('\u2011','-'))
    text=re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)',r'<link href="\2" color="#000000"><u>\1</u></link><br/><font size="9">\2</font><br/>',text)
    text=re.sub(r'`([^`]+)`',r'<font name="Courier">\1</font>',text)
    return re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',text)

story=[Paragraph('CHOCHI MOCHI · NOTES FOR GROWN-UPS',styles['NotesSmall'])]
lines=(root/'docs/RESEARCH.md').read_text().strip().splitlines()
i=0; history=False
while i<len(lines):
    line=lines[i]
    if not line.strip():i+=1;continue
    h=re.match(r'^(#{1,3}) (.+)$',line)
    if h:
        title=h.group(2);depth=len(h.group(1))
        if title.startswith('Expanded story edition'):
            history=True
            story.extend([PageBreak(),Paragraph('Adaptation history',styles['NotesH2']),Paragraph('These entries record earlier editions. They describe how the educational story grew; they do not add treatment instructions.',styles['NotesBody'])])
        style=styles['NotesTitle'] if depth==1 else styles['NotesH3'] if history else styles['NotesH2']
        story.append(Paragraph(inline(title),style));i+=1;continue
    if line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].startswith('|'):
            rows.append([c.strip() for c in lines[i].split('|')[1:-1]]);i+=1
        rows.pop(1)
        data=[[Paragraph(inline(c),styles['NotesCellHead'] if n==0 else styles['NotesCell']) for c in row] for n,row in enumerate(rows)]
        table=Table(data,colWidths=[45,132,347],repeatRows=1,hAlign='LEFT')
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,0),(-1,0),.7,colors.black),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#aaaaaa'))]))
        story.extend([table,Spacer(1,10)]);continue
    item=re.match(r'^(- |\d+\. )(.*)$',line)
    if item:
        marker=item.group(1).strip()
        # Keep each source or boundary together; wrap naturally within its paragraph.
        rendered=inline(item.group(2))
        source=re.match(r'^\[([^\]]+)\]\((https?://[^\s)]+)\)(.*)$',item.group(2))
        if source:
            label,url,description=source.groups()
            rendered=f'<link href="{escape(url)}" color="#000000"><u>{escape(label)}</u></link>{inline(description)}<br/><font size="9">{escape(url)}</font>'
        p=Paragraph((marker if marker!='-' else '•')+' '+rendered,ParagraphStyle(name='Item',parent=styles['NotesBody'],leftIndent=14,firstLineIndent=-14,keepTogether=True))
        story.append(p);i+=1;continue
    paragraph=[]
    while i<len(lines) and lines[i].strip() and not re.match(r'^(#{1,3} |\||- |\d+\. )',lines[i]):
        paragraph.append(lines[i]);i+=1
    story.append(KeepTogether([Paragraph(inline(' '.join(paragraph)),styles['NotesBody'])]))

def footer(canvas,doc):
    canvas.saveState();canvas.setStrokeColor(colors.HexColor('#aaaaaa'));canvas.setLineWidth(.4);canvas.line(44,35,568,35)
    canvas.setFont('Helvetica',8);canvas.setFillColor(colors.black)
    canvas.drawString(44,23,'Chochi Mochi · Curriculum sources and adaptation notes')
    canvas.drawRightString(568,23,f'Page {doc.page}');canvas.restoreState()

doc=SimpleDocTemplate(str(output),pagesize=letter,rightMargin=44,leftMargin=44,topMargin=40,bottomMargin=49,title='Chochi Mochi: Curriculum sources and adaptation notes',author='Chochi Mochi',subject='Sources, lesson mapping, and adaptation boundaries')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
shutil.copy2(output,root/'docs/chochi-mochi-curriculum-notes.pdf')
print(output)
