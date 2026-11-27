import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="none"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def add_header_kop(doc):
    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(1.2), Inches(4.3), Inches(1.2)]
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

    # Left cell: Logo Ganesha Operation
    cell_l = table.cell(0, 0)
    p_l = cell_l.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT
    logo_go = os.path.abspath("public/images/logo-ganesha-operation.png")
    if os.path.exists(logo_go):
        p_l.add_run().add_picture(logo_go, width=Inches(0.95))

    # Center cell: Header text
    cell_c = table.cell(0, 1)
    p_c = cell_c.paragraphs[0]
    p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c.paragraph_format.line_spacing = 1.1
    p_c.paragraph_format.space_after = Pt(0)
    
    r1 = p_c.add_run("GANESHA OPERATION\n")
    r1.font.name = "Arial"
    r1.font.size = Pt(12)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(185, 28, 28) # Red 700

    r2 = p_c.add_run("PANITIA PELAKSANA TI BILLIARD CUP 2026\n")
    r2.font.name = "Arial"
    r2.font.size = Pt(11)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(15, 23, 42)

    r3 = p_c.add_run("DEPARTEMEN TEKNOLOGI INFORMASI\n")
    r3.font.name = "Arial"
    r3.font.size = Pt(10)
    r3.font.bold = True
    r3.font.color.rgb = RGBColor(71, 85, 105)

    r4 = p_c.add_run("Venue: Greenlight Cafe & Billiard — Jl. Purnawarman No. 36B, Bandung • Hotline: 0851-8997-0998\nWebsite: https://open-tournament.ganeshaoperationexpert.com")
    r4.font.name = "Arial"
    r4.font.size = Pt(8)
    r4.font.color.rgb = RGBColor(100, 116, 139)

    # Right cell: Logo IT DEPT
    cell_r = table.cell(0, 2)
    p_r = cell_r.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    logo_it = os.path.abspath("public/images/logo-it-dept.png")
    if os.path.exists(logo_it):
        p_r.add_run().add_picture(logo_it, width=Inches(0.95))

    # Double divider line under Kop
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(4)
    p_div.paragraph_format.space_after = Pt(12)
    p_div_border = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="double" w:sz="12" w:space="4" w:color="991B1B"/></w:pBdr>')
    p_div._element.get_or_add_pPr().append(p_div_border)

def add_title(doc, title, subtitle=None, doc_no=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15

    r = p.add_run(title.upper() + "\n")
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    if subtitle:
        r_sub = p.add_run(subtitle + "\n")
        r_sub.font.name = "Arial"
        r_sub.font.size = Pt(10)
        r_sub.font.bold = True
        r_sub.font.color.rgb = RGBColor(185, 28, 28)

    if doc_no:
        r_no = p.add_run(f"Nomor Dokumen: {doc_no}")
        r_no.font.name = "Arial"
        r_no.font.size = Pt(9)
        r_no.font.italic = True
        r_no.font.color.rgb = RGBColor(100, 116, 139)

def add_section_heading(doc, text, color=RGBColor(185, 28, 28)):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(11.5)
    run.font.bold = True
    run.font.color.rgb = color
    
    # Underline border for section
    bdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="2" w:color="CBD5E1"/></w:pBdr>')
    p._element.get_or_add_pPr().append(bdr)

def add_pic_box(doc, pic_title, pic_name, pic_contact=""):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.7)
    set_cell_background(cell, "F1F5F9") # slate-100
    set_cell_margins(cell, top=80, bottom=80, left=140, right=140)
    
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="991B1B"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    
    r_t = p.add_run(f"PENANGGUNG JAWAB (PIC) : ")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(8.5)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(100, 116, 139)

    r_n = p.add_run(f"{pic_name} ")
    r_n.font.name = "Arial"
    r_n.font.size = Pt(9.5)
    r_n.font.bold = True
    r_n.font.color.rgb = RGBColor(15, 23, 42)

    if pic_contact:
        r_c = p.add_run(f"• Kontak/Lokasi: {pic_contact}")
        r_c.font.name = "Arial"
        r_c.font.size = Pt(9)
        r_c.font.bold = True
        r_c.font.color.rgb = RGBColor(185, 28, 28)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(2)
    p_sp.paragraph_format.space_after = Pt(4)

def add_bullet_point(doc, bold_prefix, text, num=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.left_indent = Inches(0.25)

    prefix_str = f"{num}. " if num else "• "
    r_p = p.add_run(prefix_str)
    r_p.font.name = "Arial"
    r_p.font.size = Pt(9.5)
    r_p.font.bold = True
    r_p.font.color.rgb = RGBColor(185, 28, 28)

    if bold_prefix:
        r_b = p.add_run(bold_prefix + " ")
        r_b.font.name = "Arial"
        r_b.font.size = Pt(9.5)
        r_b.font.bold = True
        r_b.font.color.rgb = RGBColor(15, 23, 42)

    r_t = p.add_run(text)
    r_t.font.name = "Arial"
    r_t.font.size = Pt(9.5)
    r_t.font.color.rgb = RGBColor(51, 65, 85)

def add_signature_block(doc, sk_title=""):
    """
    Menambahkan blok tanda tangan Ketua Panitia dan Manager TI khusus untuk tiap lembar S&K
    """
    p_head = doc.add_paragraph()
    p_head.paragraph_format.space_before = Pt(10)
    p_head.paragraph_format.space_after = Pt(4)
    p_head.paragraph_format.keep_with_next = True
    
    r_sh = p_head.add_run(f"LEMBAR PENGESAHAN : {sk_title.upper()}")
    r_sh.font.name = "Arial"
    r_sh.font.size = Pt(9)
    r_sh.font.bold = True
    r_sh.font.color.rgb = RGBColor(100, 116, 139)

    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(3.35), Inches(3.35)]
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

    # Left cell: Ketua Pelaksana
    cell_left = table.cell(0, 0)
    set_cell_background(cell_left, "FAFAFA")
    set_cell_margins(cell_left, top=80, bottom=80, left=120, right=120)
    p_left = cell_left.paragraphs[0]
    p_left.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_left.paragraph_format.line_spacing = 1.1
    p_left.paragraph_format.space_after = Pt(0)
    r1 = p_left.add_run("Ditetapkan di Bandung, 27 November 2026\nKetua Pelaksana Turnamen,\n\n\n\n\n")
    r1.font.name = "Arial"
    r1.font.size = Pt(9)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(30, 41, 59)

    r_name_l = p_left.add_run("MICHAEL SEAN PASQUALE THOMAS\n")
    r_name_l.font.name = "Arial"
    r_name_l.font.size = Pt(9.5)
    r_name_l.font.bold = True
    r_name_l.font.underline = True
    r_name_l.font.color.rgb = RGBColor(15, 23, 42)

    r_title_l = p_left.add_run("Staf Pusat Mobile Platform / IT Dept")
    r_title_l.font.name = "Arial"
    r_title_l.font.size = Pt(8.5)
    r_title_l.font.color.rgb = RGBColor(100, 116, 139)

    # Right cell: Manager TI
    cell_right = table.cell(0, 1)
    set_cell_background(cell_right, "FAFAFA")
    set_cell_margins(cell_right, top=80, bottom=80, left=120, right=120)
    p_right = cell_right.paragraphs[0]
    p_right.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_right.paragraph_format.line_spacing = 1.1
    p_right.paragraph_format.space_after = Pt(0)
    r2 = p_right.add_run("Mengetahui & Menyetujui,\nManajer Departemen Teknologi Informasi,\n\n\n\n\n")
    r2.font.name = "Arial"
    r2.font.size = Pt(9)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(30, 41, 59)

    r_name_r = p_right.add_run("ANDY YUSUF MARTUA, S.T., M.M.\n")
    r_name_r.font.name = "Arial"
    r_name_r.font.size = Pt(9.5)
    r_name_r.font.bold = True
    r_name_r.font.underline = True
    r_name_r.font.color.rgb = RGBColor(15, 23, 42)

    r_title_r = p_right.add_run("Kepala Departemen Teknologi Informasi")
    r_title_r.font.name = "Arial"
    r_title_r.font.size = Pt(8.5)
    r_title_r.font.color.rgb = RGBColor(100, 116, 139)

    # Table border
    set_table_borders(table, color="E2E8F0", sz="4", val="single")

    p_post = doc.add_paragraph()
    p_post.paragraph_format.space_before = Pt(4)
    p_post.paragraph_format.space_after = Pt(8)

def generate_full_regulation_docx():
    doc = Document()

    # Set page size to A4
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
        # Configure Header & Footer
        header = section.header
        p_hdr = header.paragraphs[0]
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_hdr = p_hdr.add_run("TI BILLIARD CUP 2026 • Petunjuk Pelaksanaan & S&K Resmi")
        r_hdr.font.name = "Arial"
        r_hdr.font.size = Pt(8)
        r_hdr.font.color.rgb = RGBColor(148, 163, 184)

        footer = section.footer
        p_ftr = footer.paragraphs[0]
        p_ftr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_ftr = p_ftr.add_run("Dokumen Resmi Panitia TI Billiard Cup 2026 — Ganesha Operation Pusat")
        r_ftr.font.name = "Arial"
        r_ftr.font.size = Pt(8)
        r_ftr.font.color.rgb = RGBColor(148, 163, 184)

    # =========================================================================
    # HALAMAN 1: KOP SURAT, JUDUL DOKUMEN & KETENTUAN UMUM
    # =========================================================================
    add_header_kop(doc)
    add_title(
        doc,
        title="PETUNJUK PELAKSANAAN, REGULASI TEKNIS & SYARAT KETENTUAN (S&K)",
        subtitle="TURNAMEN BILIAR BOLA 8 ANTAR BIDANG — TI BILLIARD CUP 2026",
        doc_no="001/SK-REG/PAN-TIBILLIARD/GO-TI/XI/2026"
    )

    # Paragraf Pengantar
    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_before = Pt(6)
    p_intro.paragraph_format.space_after = Pt(6)
    p_intro.paragraph_format.line_spacing = 1.15
    r_intro = p_intro.add_run(
        "Dalam rangka mempererat tali silaturahmi, soliditas, dan memupuk sportivitas antar rekan kerja di lingkungan Ganesha Operation, "
        "Departemen Teknologi Informasi (IT Dept) menyelenggarakan Turnamen Biliar Bola 8 Antar Bidang bertajuk "
    )
    r_intro.font.name = "Arial"
    r_intro.font.size = Pt(9.5)
    r_intro.font.color.rgb = RGBColor(51, 65, 85)

    r_name = p_intro.add_run("TI BILLIARD CUP 2026 ")
    r_name.font.name = "Arial"
    r_name.font.size = Pt(9.5)
    r_name.font.bold = True
    r_name.font.color.rgb = RGBColor(185, 28, 28)

    r_intro2 = p_intro.add_run(
        "yang memperebutkan Piala Bergilir Direktur Perencanaan beserta Trophy Tetap Juara 1, 2, dan 3. "
        "Dokumen ini memuat seluruh aturan teknis, pembagian tugas penanggung jawab (PIC), dan syarat & ketentuan (S&K) yang wajib dipatuhi "
        "oleh seluruh atlet, official, suporter, dan penonton demi kelancaran kegiatan."
    )
    r_intro2.font.name = "Arial"
    r_intro2.font.size = Pt(9.5)
    r_intro2.font.color.rgb = RGBColor(51, 65, 85)

    # Informasi Waktu & Tempat (Table 2 cols)
    t_info = doc.add_table(rows=4, cols=2)
    t_info.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_info.autofit = False
    set_table_borders(t_info, color="CBD5E1", sz="4", val="single")

    info_data = [
        ("Waktu Pelaksanaan Turnamen", "Mulai Kamis, 03 Desember 2026 (Pukul 18.00 - 20.00 WIB)"),
        ("Pertemuan Teknis (Technical Meeting)", "Rabu, 02 Desember 2026 (Pukul 16.30 WIB)"),
        ("Batas Akhir Pendaftaran Pemain", "Selasa, 01 Desember 2026 (Pukul 23.59 WIB)"),
        ("Lokasi Pertandingan (Venue)", "Greenlight Cafe & Billiard — Jl. Purnawarman No. 36B, Bandung"),
    ]

    for idx, (label, val) in enumerate(info_data):
        row = t_info.rows[idx]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width = Inches(2.5)
        c2.width = Inches(4.2)
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c2, top=60, bottom=60, left=100, right=100)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r_l = p1.add_run(label)
        r_l.font.name = "Arial"
        r_l.font.size = Pt(9)
        r_l.font.bold = True
        r_l.font.color.rgb = RGBColor(30, 41, 59)

        p2 = c2.paragraphs[0]
        p2.paragraph_format.space_after = Pt(0)
        r_v = p2.add_run(val)
        r_v.font.name = "Arial"
        r_v.font.size = Pt(9)
        r_v.font.color.rgb = RGBColor(15, 23, 42)

    # Kuota Delegasi Bidang
    add_section_heading(doc, "KETENTUAN KUOTA PENDAFTARAN RESMI DELEGASI BIDANG (GRATIS)")
    add_bullet_point(doc, "Kategori 1: Ganda (Campuran / Bebas)", "Maksimal 2 Tim / Bidang (2 orang per tim). Komposisi pasangan dibebaskan: boleh Ganda Campuran (Putra & Putri), Putra & Putra, maupun Putri & Putri. Memperebutkan Piala Bergilir Utama Direktur Perencanaan.")
    add_bullet_point(doc, "Kategori 2: Single Putra", "1 Tim / Bidang (1 orang per tim). Memperebutkan Trophy Tetap Juara 1, 2, dan 3.")
    add_bullet_point(doc, "Kategori 3: Single Putri", "1 Tim / Bidang (1 orang per tim). Memperebutkan Trophy Tetap Juara 1, 2, dan 3.")
    add_bullet_point(doc, "Biaya Pendaftaran", "GRATIS / Bebas Biaya untuk seluruh 20 bidang yang diundang resmi di lingkungan Ganesha Operation.")

    # 20 Bidang Diundang
    add_section_heading(doc, "DAFTAR 20 BIDANG DIUNDANG RESMI")
    p_bidang = doc.add_paragraph()
    p_bidang.paragraph_format.space_before = Pt(2)
    p_bidang.paragraph_format.space_after = Pt(6)
    p_bidang.paragraph_format.line_spacing = 1.15
    bidang_names = [
        "1. Teknologi Informasi (IT DEPT - Tuan Rumah)", "2. Marketing", "3. Selling", "4. Manajer Logistik dan Distribusi",
        "5. Penelitian dan Pengembangan (Litbang)", "6. Manajer Akuntansi", "7. Sumber Daya Manusia (SDM)", "8. Koordinator Kepala Bagian Audit Rekening",
        "9. Manajer Keuangan", "10. Manajer Personalia", "11. Sarana Operasional", "12. Audit Operasional",
        "13. Koordinator Bagian Bimbingan Konseling dan Pengajaran", "14. Pusat Informasi Konsumen", "15. Sekretariat Pembina", "16. Sekretariat Direktur Utama",
        "17. Sekretariat Direktur Operasional", "18. Sekretariat Direktur Perencanaan", "19. Bagian Umum", "20. Hubungan Masyarakat (Humas)"
    ]
    r_bid = p_bidang.add_run(";  ".join(bidang_names))
    r_bid.font.name = "Arial"
    r_bid.font.size = Pt(8.5)
    r_bid.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_page_break()

    # =========================================================================
    # HALAMAN 2: S&K 1 - REGULASI PERTANDINGAN RESMI
    # =========================================================================
    add_section_heading(doc, "1. SYARAT & KETENTUAN (S&K) PERTANDINGAN RESMI BOLA 8", color=RGBColor(185, 28, 28))
    add_pic_box(doc, "PIC Pertandingan", "Michael Sean Pasquale Thomas & Dewan Wasit TI", "0851-8997-0998")

    add_bullet_point(doc, "Integritas & Identitas Atlet:", "Seluruh atlet yang bertanding wajib berstatus karyawan aktif Ganesha Operation di bidang yang didaftarkan. Dilarang keras menggunakan joki/pemain sewaan dari luar bidang. Jika terbukti menggunakan joki, bidang yang bersangkutan langsung didiskualifikasi dari seluruh kategori turnamen.", num="1.1")
    add_bullet_point(doc, "Disiplin Waktu & Batas Walkover (WO):", "Atlet wajib hadir di area meja tanding 15 menit sebelum jadwal pertandingan dimulai. Toleransi keterlambatan maksimal 15 menit setelah panggilan resmi wasit meja. Apabila melewati batas toleransi tersebut pemain belum hadir di meja, wasit berhak memberikan kemenangan Walkover (WO) kepada lawan.", num="1.2")
    add_bullet_point(doc, "Format Pertandingan Standar WPA:", "Menggunakan bola 8 standar World Pool-Billiard Association (WPA). Babak Penyisihan Grup menggunakan sistem Race to 4 frame, break bergantian atau ditentukan melalui lag.", num="1.3")
    add_bullet_point(doc, "Pakaian & Standar Etika Bertanding:", "Setiap atlet wajib mengenakan pakaian rapi berkerah (baju polo / seragam perwakilan bidang) dan bersepatu. Dilarang keras bertanding mengenakan sandal jepit, celana tidur/kolor tidak resmi, atau kaos oblong tanpa kerah.", num="1.4")
    add_bullet_point(doc, "Keputusan Wasit Mutlak:", "Wasit meja memegang kendali penuh atas jalannya pertandingan, termasuk penetapan foul, bola sah, dan alur permainan. Keputusan wasit bersifat final, mutlak, dan mengikat.", num="1.5")
    add_bullet_point(doc, "Sportivitas & Saling Menghormati:", "Pemain diwajibkan berjabat tangan sebelum dan sesudah pertandingan selesai. Segala bentuk perilaku tidak sportif seperti melempar stik biliar atau mencaci lawan akan berakibat teguran keras hingga diskualifikasi.", num="1.6")

    # Signature Block S&K 1
    add_signature_block(doc, "S&K 1 — Pertandingan Resmi Bola 8")

    doc.add_page_break()

    # =========================================================================
    # HALAMAN 3: S&K 2 - MINI GAMES & DOORPRIZE MEJA 6
    # =========================================================================
    add_section_heading(doc, "2. SYARAT & KETENTUAN (S&K) MINI GAMES & DOORPRIZE MEJA 6", color=RGBColor(217, 119, 6))
    add_pic_box(doc, "PIC Meja 6 & Mini Games", "Wildan Farid Afif & Yudha Kusetyadi", "Stand Resmi Meja 6")

    add_bullet_point(doc, "Hak Kepesertaan:", "Tantangan Mini Game Meja 6 terbuka untuk seluruh keluarga besar Ganesha Operation yang hadir di lokasi venue (baik atlet yang sudah gugur/sedang rehat, official bidang, maupun suporter/penonton).", num="2.1")
    add_bullet_point(doc, "Ketertiban Antrean & Kuota Percobaan:", "Demi asas keadilan bagi seluruh hadirin, setiap peserta hanya berhak atas 1 (satu) kali kesempatan tembakan/percobaan per sesi antrean. Dilarang memonopoli meja atau menyerobot antrean rekan kerja lainnya.", num="2.2")
    add_bullet_point(doc, "Pilihan Tingkat Kesulitan Tantangan:", "Peserta dapat memilih salah satu tingkat kesulitan tantangan trickshot:", num="2.3")
    
    # Sub-bullets for prizes
    p_sb1 = doc.add_paragraph()
    p_sb1.paragraph_format.left_indent = Inches(0.5)
    p_sb1.paragraph_format.space_after = Pt(2)
    p_sb1.paragraph_format.line_spacing = 1.15
    r_sb1 = p_sb1.add_run("a. Kategori Sulit (Tantangan Mahir): ")
    r_sb1.font.bold = True
    r_sb1.font.size = Pt(9)
    r_sb1_t = p_sb1.add_run("Hadiah berupa Kaos Official TI Billiard Cup 2026, Topi Eksklusif, Tumbler Stainless Termos, Mug Keramik Berlogo, Voucher Belanja Indomaret Rp 100.000, dan Voucher Belanja Indomaret Rp 50.000.")
    r_sb1_t.font.size = Pt(9)

    p_sb2 = doc.add_paragraph()
    p_sb2.paragraph_format.left_indent = Inches(0.5)
    p_sb2.paragraph_format.space_after = Pt(3)
    p_sb2.paragraph_format.line_spacing = 1.15
    r_sb2 = p_sb2.add_run("b. Kategori Mudah / Gampang: ")
    r_sb2.font.bold = True
    r_sb2.font.size = Pt(9)
    r_sb2_t = p_sb2.add_run("Hadiah berupa Gantungan Kunci Akrilik Resmi TI Billiard Cup 2026 dan Paket Snack / Indomie Cup Spesial.")
    r_sb2_t.font.size = Pt(9)

    add_bullet_point(doc, "Mekanisme Pengambilan & Klaim Hadiah:", "Ketentuan klaim hadiah diatur ketat sebagai berikut:", num="2.4")
    
    p_cl1 = doc.add_paragraph()
    p_cl1.paragraph_format.left_indent = Inches(0.5)
    p_cl1.paragraph_format.space_after = Pt(2)
    p_cl1.paragraph_format.line_spacing = 1.15
    r_cl1 = p_cl1.add_run("• Hadiah Tingkat Mudah (Gantungan Kunci & Snack): ")
    r_cl1.font.bold = True
    r_cl1.font.size = Pt(9)
    p_cl1.add_run("Langsung diserahkan di tempat (Stand Meja 6) setelah tantangan dinyatakan sah oleh PIC Meja 6.").font.size = Pt(9)

    p_cl2 = doc.add_paragraph()
    p_cl2.paragraph_format.left_indent = Inches(0.5)
    p_cl2.paragraph_format.space_after = Pt(3)
    p_cl2.paragraph_format.line_spacing = 1.15
    r_cl2 = p_cl2.add_run("• Hadiah Tingkat Sulit (Apparel, Tumbler, & Voucher): ")
    r_cl2.font.bold = True
    r_cl2.font.size = Pt(9)
    p_cl2.add_run("Hanya diserahkan saat Final Day di akhir acara penutupan kejuaraan. Pemenang DIWAJIBKAN HADIR LANGSUNG pada sesi seremonial penutupan turnamen untuk menerima hadiah fisik.").font.size = Pt(9)

    add_bullet_point(doc, "Pemeliharaan Meja 6:", "Dilarang keras meletakkan gelas minuman, abu rokok, atau makanan di atas bantalan (cushion) maupun laken Meja 6.", num="2.5")

    # Signature Block S&K 2
    add_signature_block(doc, "S&K 2 — Mini Games & Doorprize Meja 6")

    doc.add_page_break()

    # =========================================================================
    # HALAMAN 4: S&K 3 - PENDUKUNG TERHEBOH (BEST SUPPORTER)
    # =========================================================================
    add_section_heading(doc, "3. SYARAT & KETENTUAN (S&K) PENDUKUNG TERHEBOH (BEST SUPPORTER AWARD)", color=RGBColor(225, 29, 72))
    add_pic_box(doc, "PIC Pendukung Terheboh", "Tim Supporter & Dokumentasi Kreatif TI", "Tribun & Area Penonton")

    add_bullet_point(doc, "Maksud & Tujuan Penghargaan:", "Penghargaan Best Supporter diberikan khusus kepada kontingen bidang yang menunjukkan solidaritas, energi positif, sportivitas, dan kekompakan terbaik dalam mendukung atlet perwakilan bidangnya bertanding.", num="3.1")
    add_bullet_point(doc, "Bobot Kriteria Penilaian Juri Resmi:", "Penilaian dilakukan oleh tim juri independen panitia pelaksana dengan indikator:", num="3.2")

    p_juri = doc.add_paragraph()
    p_juri.paragraph_format.left_indent = Inches(0.5)
    p_juri.paragraph_format.space_after = Pt(3)
    p_juri.paragraph_format.line_spacing = 1.15
    juri_items = [
        ("Kekompakan & Jumlah Kehadiran Anggota Bidang", "Bobot 35%"),
        ("Kreativitas Atribut, Yel-Yel, Seragam/Kostum, & Banner", "Bobot 30%"),
        ("Sportivitas & Sikap Saling Menghormati Lawan", "Bobot 25%"),
        ("Kebersihan & Kerapian Area Tribun Pendukung", "Bobot 10%")
    ]
    for jt, jb in juri_items:
        r_jt = p_juri.add_run(f"• {jt}: ")
        r_jt.font.size = Pt(9)
        r_jb = p_juri.add_run(f"{jb}\n")
        r_jb.font.bold = True
        r_jb.font.size = Pt(9)

    add_bullet_point(doc, "Etika Bersorak yang Diizinkan:", "Suporter sangat dianjurkan menyuarakan yel-yel, bernyanyi, bertepuk tangan, dan mengibarkan bendera/banner bidang SEBELUM atlet menembak atau SETELAH bola berhenti meluncur. Berikan suntikan moral terbaik bagi kontingen Anda.", num="3.3")
    add_bullet_point(doc, "Larangan Alat Bunyi Tajam & Ekstrem:", "Dilarang keras membawa atau membunyikan klakson gas/airhorn darurat bertekanan tinggi, peluit wasit berfrekuensi tajam, petasan/kembang api, atau pengeras suara sirine yang dapat merusak konsentrasi dan aba-aba wasit meja.", num="3.4")
    add_bullet_point(doc, "Bebas SARA & Provokasi:", "Yel-yel wajib berisi motivasi positif bagi bidang sendiri. Dilarang keras melontarkan provokasi personal, kata-kata kasar/hinaan, atau muatan SARA terhadap atlet maupun suporter bidang lain.", num="3.5")

    # Signature Block S&K 3
    add_signature_block(doc, "S&K 3 — Pendukung Terheboh (Best Supporter)")

    doc.add_page_break()

    # =========================================================================
    # HALAMAN 5: S&K 4 - TATA TERTIB PENONTON & PROTOKOL VENUE GREENLIGHT
    # =========================================================================
    add_section_heading(doc, "4. SYARAT & KETENTUAN (S&K) TATA TERTIB PENONTON & PROTOKOL VENUE GREENLIGHT", color=RGBColor(79, 70, 229))
    add_pic_box(doc, "PIC Penonton & Ketertiban Venue", "Tim Ketertiban, Keamanan, & Venue TI", "Area Meja 1 s.d Meja 6")

    add_bullet_point(doc, "Batas Steril Area Pertandingan:", "Penonton dan official wajib berdiri di luar batas garis pengaman dengan jarak minimal 1,5 meter dari meja biliar. Hal ini wajib dipatuhi agar tidak menyenggol stik biliar atau menghalangi ruang ayun atlet (*cue swing zone*).", num="4.1")
    add_bullet_point(doc, "Larangan Coaching / Instruksi Saat Giliran Menembak:", "Penonton, rekan satu tim, maupun suporter dilarang keras berteriak memberikan instruksi arah bola, pilihan target, atau petunjuk strategi saat atlet sedang berada di giliran menembak.", num="4.2")
    add_bullet_point(doc, "LARANGAN LAMPU KILAT (FLASH KAMERA):", "Pengambilan foto dan video untuk dokumentasi media sosial sangat dianjurkan, namun LAMPU KILAT (FLASH) WAJIB DIMATIKAN karena sangat menyilaukan dan membahayakan akurasi pandangan atlet.", num="4.3")
    add_bullet_point(doc, "Ketenangan Saat Aiming / Stance:", "Saat atlet lawan maupun kawan telah memasuki posisi siap membidik (*stance*), seluruh penonton dimohon menahan suara agar atlet dapat berkonsentrasi penuh.", num="4.4")
    add_bullet_point(doc, "Larangan Merokok & Vape di Dalam Ruangan:", "Dilarang keras merokok konvensional maupun rokok elektrik (vape) di dalam seluruh ruangan ber-AC Greenlight Billiard. Merokok hanya diperkenankan di area luar/smoking area yang telah ditentukan pengelola.", num="4.5")
    
    # KETENTUAN KHUSUS VENUE GREENLIGHT
    add_bullet_point(doc, "Kebijakan Makanan & Minuman dari Luar:", "Pihak pengelola Greenlight Billiard MELARANG membawa makanan dan minuman dari luar ke dalam area, kecuali konsumsi resmi yang dibagikan oleh panitia penyelenggara. Peserta dan suporter dihimbau memanfaatkan fasilitas F&B di kafetaria Greenlight.", num="4.6")
    add_bullet_point(doc, "LARANGAN KERAS MINUMAN BERALKOHOL / MIRAS:", "Panitia menegaskan LARANGAN MUTLAK bagi seluruh peserta, atlet, suporter, dan official dari Ganesha Operation untuk membeli, membawa, maupun mengonsumsi minuman keras/beralkohol di Greenlight Billiard selama seluruh rangkaian kegiatan berlangsung. Pelanggaran atas aturan ini akan langsung dilaporkan kepada Manajemen SDM Ganesha Operation untuk diberikan sanksi kedisiplinan.", num="4.7")
    add_bullet_point(doc, "Ketentuan Parkir Kendaraan:", "Fasilitas parkir gratis (Free Parking) hanya diberikan kepada panitia resmi yang plat nomor kendaraannya telah didaftarkan ke pihak pengelola Greenlight. Untuk atlet, peserta, dan suporter berlaku tarif parkir reguler venue.", num="4.8")
    add_bullet_point(doc, "Pemeliharaan Kebersihan & Fasilitas Venue:", "Toilet, AC, kipas angin, dan meja biliar di-maintain secara berkala oleh staf Greenlight. Setiap hadirin wajib menjaga kebersihan ruangan, membuang sampah pada tempatnya, dan dilarang menaruh gelas basah di atas bibir meja biliar.", num="4.9")

    # Signature Block S&K 4
    add_signature_block(doc, "S&K 4 — Tata Tertib Penonton & Protokol Venue")

    doc.add_page_break()

    # =========================================================================
    # HALAMAN 6: STRUKTUR OPERASIONAL PJ MEJA & REGULASI TEKNIS BOLA 8 WPA
    # =========================================================================
    add_section_heading(doc, "5. PENUGASAN RESMI PENANGGUNG JAWAB (PJ) & WASIT MEJA (MEJA 1 – 6)")
    p_pj_desc = doc.add_paragraph()
    p_pj_desc.paragraph_format.space_before = Pt(2)
    p_pj_desc.paragraph_format.space_after = Pt(6)
    p_pj_desc.paragraph_format.line_spacing = 1.15
    r_pj_d = p_pj_desc.add_run(
        "Untuk menjamin kelancaran pertandingan, akurasi pencatatan skor, dan penegakan regulasi secara adil, "
        "setiap meja diawasi oleh 2 orang personil resmi dari Departemen Teknologi Informasi:"
    )
    r_pj_d.font.name = "Arial"
    r_pj_d.font.size = Pt(9.5)
    r_pj_d.font.color.rgb = RGBColor(51, 65, 85)

    # Table of 12 Table Officials
    tbl_pj = doc.add_table(rows=13, cols=4)
    tbl_pj.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_pj.autofit = False
    set_table_borders(tbl_pj, color="CBD5E1", sz="4", val="single")

    pj_headers = ["Meja", "Fungsi Meja", "Nama Personil Penanggung Jawab (PJ)", "Peran & Tugas"]
    hdr_row = tbl_pj.rows[0]
    for idx, h_text in enumerate(pj_headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "1E293B")
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h_text)
        run.font.name = "Arial"
        run.font.size = Pt(8.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)

    officials_data = [
        ("Meja 1", "Pertandingan Bola 8", "Musbahniar", "Wasit Utama Meja 1"),
        ("Meja 1", "Pertandingan Bola 8", "Abraham Wellmart Marudut Tua Siahaan", "Pengawas & Pencatat Skor Meja 1"),
        ("Meja 2", "Pertandingan Bola 8", "Roy Aziz Barera", "Wasit Utama Meja 2"),
        ("Meja 2", "Pertandingan Bola 8", "Muhammad Asman", "Pengawas & Pencatat Skor Meja 2"),
        ("Meja 3", "Pertandingan Bola 8", "Calvin Satria Dewangga Putra H", "Wasit Utama Meja 3"),
        ("Meja 3", "Pertandingan Bola 8", "Muhammad Alwin Lapapahi", "Pengawas & Pencatat Skor Meja 3"),
        ("Meja 4", "Pertandingan Bola 8", "Raihan Fuad Syakir", "Wasit Utama Meja 4"),
        ("Meja 4", "Pertandingan Bola 8", "Muhammad Ilham Rizki Pratama", "Pengawas & Pencatat Skor Meja 4"),
        ("Meja 5", "Pertandingan Bola 8", "Dzakiy Harissalam", "Wasit Utama Meja 5"),
        ("Meja 5", "Pertandingan Bola 8", "Ahmad Yoga Witdodo", "Pengawas & Pencatat Skor Meja 5"),
        ("Meja 6", "Mini Games & Doorprize", "Wildan Farid Afif", "Koordinator Mini Game Meja 6"),
        ("Meja 6", "Mini Games & Doorprize", "Yudha Kusetyadi", "PJ Validasi & Doorprize Meja 6"),
    ]

    for idx, (meja, tipe, nama, peran) in enumerate(officials_data):
        row = tbl_pj.rows[idx + 1]
        bg_color = "FFFBEB" if "Meja 6" in meja else ("F8FAFC" if idx % 2 == 0 else "FFFFFF")
        for c_idx, val in enumerate([meja, tipe, nama, peran]):
            c = row.cells[c_idx]
            set_cell_background(c, bg_color)
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)
            if c_idx == 0 or c_idx == 2:
                r.font.bold = True
            r.font.color.rgb = RGBColor(15, 23, 42)

    # REGULASI TEKNIS BOLA 8 WPA
    add_section_heading(doc, "6. REGULASI PERTANDINGAN RESMI BOLA 8 STANDAR WPA")
    rules_wpa = [
        ("01. Penentuan Break & Lagging", "Pemain melakukan tembakan lag serentak dari head string ke foot rail. Pemain yang bolanya berhenti paling dekat dengan head rail berhak memilih melakukan break atau memberikannya kepada lawan. Pada frame berikutnya, break dilakukan bergantian."),
        ("02. Legal Break Shot", "Pemain pemecah bola (breaker) harus memasukkan minimal satu bola sasaran bernomor, ATAU menggerakkan minimal 4 bola sasaran menyentuh cushion (ban). Bila tidak tercapai, dianggap open table dan lawan berhak menerima atau meminta break ulang."),
        ("03. Pemilihan Kelompok Bola", "Kelompok bola (Solid 1-7 atau Stripes 9-15) TIDAK ditentukan saat break meskipun ada bola yang masuk. Kelompok bola sah ditentukan bila pemain memasukkan bola sasaran yang dinyatakan secara sah setelah giliran open table berikutnya."),
        ("04. Foul & Ball in Hand", "Pelanggaran terjadi apabila cue ball masuk kantong (scratch), bola sasaran pertama yang disentuh bukan bola kelompok sendiri, atau ada bola yang melompat keluar meja. Setiap foul memberikan hak 'Ball in Hand' bagi lawan di seluruh permukaan meja."),
        ("05. Ketepatan Waktu & WO", "Jadwal pertandingan dimulai pukul 18.00 WIB. Toleransi keterlambatan maksimal 15 menit dari jadwal panggilan meja. Lewat dari batas waktu tersebut dinyatakan Walkover (WO)."),
        ("06. Memasukkan Bola 8 & Ketentuan Sah", "Bola 8 hanya boleh ditembak setelah seluruh bola kelompok pemain habis dimasukkan. Pemain wajib menunjuk kantong target bola 8. Pemain dinyatakan LANGSUNG KALAH (Lost Frame) apabila: (a) memasukkan bola 8 saat bola kelompoknya belum habis, (b) memasukkan bola 8 bersamaan dengan scratch cue ball, atau (c) memasukkan bola 8 ke kantong yang tidak ditunjuk.")
    ]

    for title, desc in rules_wpa:
        add_bullet_point(doc, title + " :", desc)

    # =========================================================================
    # BAGIAN PENUTUP & PENGESAHAN DOKUMEN MASTER
    # =========================================================================
    p_penutup = doc.add_paragraph()
    p_penutup.paragraph_format.space_before = Pt(12)
    p_penutup.paragraph_format.space_after = Pt(8)
    p_penutup.paragraph_format.line_spacing = 1.15
    r_pen = p_penutup.add_run(
        "Demikian Petunjuk Pelaksanaan, Regulasi Teknis, dan Syarat Ketentuan (S&K) ini ditetapkan secara resmi "
        "untuk menjadi pedoman dan ditaati bersama oleh seluruh kontingen dan pihak yang terlibat. "
        "Mari junjung tinggi nilai sportivitas, kejujuran, dan kebersamaan keluarga besar Ganesha Operation."
    )
    r_pen.font.name = "Arial"
    r_pen.font.size = Pt(9.5)
    r_pen.font.color.rgb = RGBColor(51, 65, 85)

    add_signature_block(doc, "Dokumen Induk Regulasi TI Billiard Cup 2026")

    output_path = "/Users/mobile-go/Documents/billiard-tournament/REGULASI_DAN_SK_RESMI_TI_BILLIARD_CUP_2026.docx"
    doc.save(output_path)
    print(f"SUCCESS: Document successfully created at {output_path}")

if __name__ == "__main__":
    generate_full_regulation_docx()
