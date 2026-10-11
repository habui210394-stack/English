const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, AlignmentType, LevelFormat, TabStopType,
} = require("docx");
const { p1, p2, p3 } = require("./tao_de.js");

const FONT = "Arial";
const W = 9638; // A4 với lề 2 cm: 11906 - 2*1134 = 9638
const L = ["A", "B", "C"];
const BLUE = "1A5276", RED = "C0392B";

const t = (text, o = {}) => new TextRun({ text, font: FONT, size: 24, ...o });
const para = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [t(children)], spacing: { after: 100, line: 300 }, ...o });

const h1 = (text) => para([t(text, { bold: true, size: 32, color: RED })], { alignment: AlignmentType.CENTER, spacing: { after: 160 } });
const h2 = (text) => new Paragraph({
  children: [t(text, { bold: true, size: 26, color: "FFFFFF" })],
  shading: { type: ShadingType.CLEAR, fill: "2E86C1" },
  spacing: { before: 280, after: 140 },
  keepNext: true,
});
const h3 = (text) => para([t(text, { bold: true, color: BLUE })], { spacing: { before: 200, after: 80 }, keepNext: true });

const line = () => new Paragraph({
  children: [],
  spacing: { after: 60, line: 400 },
  border: { bottom: { style: BorderStyle.DOTTED, size: 6, color: "777777", space: 1 } },
});

const boxBorder = (color) => {
  const b = { style: BorderStyle.SINGLE, size: 8, color };
  return { top: b, bottom: b, left: b, right: b };
};
const box = (children, fill, color) => new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [W],
  rows: [new TableRow({
    cantSplit: true,
    children: [new TableCell({
      width: { size: W, type: WidthType.DXA },
      borders: boxBorder(color),
      shading: { type: ShadingType.CLEAR, fill },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children,
    })],
  })],
});
const gap = () => new Paragraph({ children: [], spacing: { after: 60 } });

const bullet = (runs) => new Paragraph({ children: runs, numbering: { reference: "bl", level: 0 }, spacing: { after: 60, line: 290 } });
const b = (x) => t(x, { bold: true, size: 22 });
const r = (x) => t(x, { size: 22 });
const i = (x) => t(x, { italics: true, size: 22 });

const numbering = { config: [{ reference: "bl", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] }] };
const styles = { default: { document: { run: { font: FONT, size: 24 } } } };
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } };

// ---------- ĐỀ ----------
const de = [];
de.push(h1("ENGLISH – GRADE 3"));
de.push(para([t("Bộ đề: like, favourite, have to / has to, do / does", { bold: true, size: 26, color: BLUE })], { alignment: AlignmentType.CENTER, spacing: { after: 200 } }));
de.push(para([t("Name: ______________________     Class: ________     Date: ___________")], { spacing: { after: 200 } }));

de.push(box([
  para([t("Ghi nhớ nhanh", { bold: true, color: "B9770E" })], { spacing: { after: 80 } }),
  bullet([b("I / You / We / They"), r(" + like → "), i("I like cats."), r("   "), b("He / She / It / tên riêng"), r(" + like"), b("s"), r(" → "), i("She likes cats.")]),
  bullet([r("Sau "), b("like"), r(" có thể dùng "), b("V-ing"), r(": "), i("I like playing football.")]),
  bullet([b("Do / Does"), r(" đặt đầu câu hỏi: "), i("Do you like fish? – Does she like fish?"), r(" Sau do / does dùng động từ nguyên mẫu (không thêm s).")]),
  bullet([r("Phủ định: "), i("I do not (don't) like… / She does not (doesn't) like…")]),
  bullet([b("favourite"), r(" = yêu thích nhất: "), i("My favourite colour is blue.")]),
  bullet([b("have to / has to"), r(" = phải làm gì: "), i("I / You / We / They "), b("have to"), i(" …;  He / She / Tom "), b("has to"), i(" …")]),
  bullet([r("Động từ thêm "), b("es"), r(" sau -s, -sh, -ch, -x, -o ("), i("watches, washes, goes"), r("). Phụ âm + y đổi y → ies ("), i("studies"), r(").")]),
], "FEF9E7", "F39C12"));

de.push(h2("Part 1. Reorder the words (Sắp xếp các từ thành câu đúng) – 15 câu"));
de.push(para([t("Viết hoa chữ cái đầu câu và thêm dấu chấm (.) hoặc dấu hỏi (?) ở cuối câu.", { italics: true, size: 21, color: "555555" })]));
p1.forEach(([w], k) => {
  de.push(new Paragraph({ children: [t(`${k + 1}. `, { bold: true }), t(w, { bold: true, color: BLUE })], spacing: { before: 120, after: 0 }, keepNext: true }));
  de.push(line());
});

de.push(h2("Part 2. Choose the correct answer (Khoanh tròn đáp án đúng) – 20 câu"));
p2.forEach(([q, o], k) => {
  de.push(new Paragraph({ children: [t(`${k + 1}. ${q}`)], spacing: { before: 120, after: 20 }, keepNext: true }));
  de.push(new Paragraph({
    children: o.flatMap((x, j) => [t(`${L[j]}. ${x}`), ...(j < 2 ? [new TextRun({ text: "\t", font: FONT })] : [])]),
    tabStops: [{ type: TabStopType.LEFT, position: 3300 }, { type: TabStopType.LEFT, position: 6300 }],
    indent: { left: 400 },
    spacing: { after: 60 },
  }));
});

de.push(h2("Part 3. Read and write True (T) or False (F) – 15 câu"));
let n = 1;
for (const d of p3) {
  de.push(h3(d.title));
  de.push(box(d.lines.map((x) => {
    const c = x.indexOf(":");
    return para([t(x.slice(0, c + 1), { bold: true, color: BLUE }), t(x.slice(c + 1))], { spacing: { after: 60 } });
  }), "FFFFFF", "85C1E9"));
  de.push(gap());
  for (const [q] of d.q) de.push(new Paragraph({ children: [t(`${n++}. ${q}   `), t("_____", { bold: true })], spacing: { after: 100 }, keepLines: true }));
}
de.push(para([t("– The end –  Good luck! –", { bold: true })], { alignment: AlignmentType.CENTER, spacing: { before: 300 } }));

// ---------- ĐÁP ÁN ----------
const da = [];
da.push(h1("ĐÁP ÁN"));
da.push(para([t("Bộ đề: like, favourite, have to / has to, do / does", { bold: true, size: 26, color: BLUE })], { alignment: AlignmentType.CENTER, spacing: { after: 160 } }));
da.push(para([t("Em hãy làm bài xong rồi mới xem đáp án nhé!", { italics: true })], { alignment: AlignmentType.CENTER }));
da.push(h2("Part 1. Reorder the words"));
p1.forEach(([, a], k) => da.push(para([t(`${k + 1}. `, { bold: true }), t(a, { bold: true, color: RED })])));
da.push(h2("Part 2. Multiple choice"));
p2.forEach(([q, o, k], idx) => da.push(para([t(`${idx + 1}. ${q.replace("___", o[k])}  →  `), t(L[k], { bold: true, color: RED })])));
da.push(h2("Part 3. True / False"));
n = 1;
for (const d of p3) {
  da.push(h3(d.title));
  for (const [q, a, why] of d.q) {
    da.push(para([t(`${n++}. ${q}  →  `), t(a, { bold: true, color: RED }), ...(why ? [t(`   (${why})`, { italics: true, size: 21, color: "555555" })] : [])]));
  }
}

const mk = (children) => new Document({ styles, numbering, sections: [{ properties: { page }, children }] });
(async () => {
  fs.writeFileSync(path.join(__dirname, "Bo_de_Tieng_Anh_Lop3.docx"), await Packer.toBuffer(mk(de)));
  fs.writeFileSync(path.join(__dirname, "Dap_an_Bo_de_Tieng_Anh_Lop3.docx"), await Packer.toBuffer(mk(da)));
  console.log("ok");
})();
