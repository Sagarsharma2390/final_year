from reportlab.platypus import SimpleDocTemplate, Paragraph

def generate_pdf(result, name):
    path = f"uploads/results/{name}.pdf"
    doc = SimpleDocTemplate(path)
    doc.build([
        Paragraph(f"Student: {name}"),
        Paragraph(f"Marks: {result['marks']}")
    ])
    return path