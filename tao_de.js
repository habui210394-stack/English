const fs = require("fs");
const path = require("path");

// Dạng 1: sắp xếp lại câu [các từ theo thứ tự đảo, đáp án]
const p1 = [
  ["I / like / apples", "I like apples."],
  ["cats / She / likes", "She likes cats."],
  ["you / Do / dogs / like / ?", "Do you like dogs?"],
  ["milk / He / like / does not", "He does not like milk."],
  ["football / like / We / playing", "We like playing football."],
  ["colour / My / blue / favourite / is", "My favourite colour is blue."],
  ["favourite / is / What / your / food / ?", "What is your favourite food?"],
  ["Maths / favourite / Her / is / subject", "Her favourite subject is Maths."],
  ["the dog / favourite / His / is / animal", "His favourite animal is the dog."],
  ["my homework / I / do / have to", "I have to do my homework."],
  ["brush / has to / He / his teeth", "He has to brush his teeth."],
  ["clean / She / her room / has to", "She has to clean her room."],
  ["to the teacher / listen / We / have to", "We have to listen to the teacher."],
  ["get up / Tom / early / has to", "Tom has to get up early."],
  ["wash / You / your hands / have to", "You have to wash your hands."],
];

// Dạng 2: trắc nghiệm [câu, [A,B,C], đáp án index]
const p2 = [
  ["My sister ___ pink.", ["like", "likes", "liking"], 1],
  ["They ___ to school every day.", ["goes", "go", "going"], 1],
  ["He ___ TV in the evening.", ["watch", "watchs", "watches"], 2],
  ["I like ___ football.", ["play", "plays", "playing"], 2],
  ["___ you like fish?", ["Do", "Does", "Is"], 0],
  ["___ she like milk?", ["Do", "Does", "Is"], 1],
  ["She ___ her face every morning.", ["wash", "washs", "washes"], 2],
  ["Tom ___ do his homework.", ["have to", "has to", "having to"], 1],
  ["We ___ keep the classroom clean.", ["has to", "have to", "having to"], 1],
  ["My dog doesn't ___ bananas.", ["likes", "like", "liking"], 1],
  ["Mai likes ___ pictures.", ["draw", "draws", "drawing"], 2],
  ["My brother ___ football on Sundays.", ["play", "plays", "playing"], 1],
  ["Do you ___ wear a uniform?", ["has to", "have to", "having to"], 1],
  ["Does he ___ get up early?", ["have to", "has to", "having to"], 0],
  ["My mother ___ cook dinner every day.", ["have to", "has to", "having to"], 1],
  ["Where ___ your friend live?", ["do", "does", "is"], 1],
  ["I ___ not like carrots.", ["do", "does", "am"], 0],
  ["She ___ not like spiders.", ["do", "does", "is"], 1],
  ["My brother likes ___ comic books.", ["read", "reads", "reading"], 2],
  ["Lan ___ English on Monday.", ["study", "studys", "studies"], 2],
];

// Dạng 3: hội thoại T/F [tiêu đề, hội thoại[], [câu, đáp án T/F, giải thích]]
const p3 = [
  {
    title: "Hội thoại 1",
    lines: [
      "Tom: Hi, Lan! What is your favourite colour?",
      "Lan: My favourite colour is pink. What about you?",
      "Tom: I like blue. It is my favourite colour.",
      "Lan: Do you like animals?",
      "Tom: Yes, I do. I like dogs. I have a dog.",
      "Lan: I like cats. I don't have a dog.",
    ],
    q: [
      ["Lan's favourite colour is pink.", "T", ""],
      ["Tom's favourite colour is red.", "F", "Tom thích màu xanh dương (blue)."],
      ["Tom likes dogs.", "T", ""],
      ["Lan likes dogs.", "F", "Lan thích mèo (cats)."],
      ["Tom has a dog.", "T", ""],
    ],
  },
  {
    title: "Hội thoại 2",
    lines: [
      "Nam: Mai, can you play with me now?",
      "Mai: Sorry, Nam. I can't. I have to clean my room.",
      "Nam: Do you have to do your homework too?",
      "Mai: Yes, I do. I have to do my English homework. And my brother has to wash the dishes.",
      "Nam: OK. Let's play after dinner!",
      "Mai: Great!",
    ],
    q: [
      ["Mai can play with Nam now.", "F", "Mai không chơi được vì phải dọn phòng."],
      ["Mai has to clean her room.", "T", ""],
      ["Mai has to do her English homework.", "T", ""],
      ["Mai's brother has to wash the dishes.", "T", ""],
      ["Nam and Mai will play after lunch.", "F", "Hai bạn chơi sau bữa tối (after dinner)."],
    ],
  },
  {
    title: "Hội thoại 3",
    lines: [
      "Ben: What do you like for breakfast, Lucy?",
      "Lucy: I like bread and milk. My favourite food is bread.",
      "Ben: My favourite food is noodles. But my sister doesn't like noodles.",
      "Lucy: What does she like?",
      "Ben: She likes eggs. She has an egg every morning.",
      "Lucy: Wow!",
    ],
    q: [
      ["Lucy likes bread and milk.", "T", ""],
      ["Lucy's favourite food is noodles.", "F", "Món yêu thích của Lucy là bánh mì (bread)."],
      ["Ben's favourite food is noodles.", "T", ""],
      ["Ben's sister likes noodles.", "F", "Em gái Ben không thích mì (doesn't like)."],
      ["Ben's sister has an egg every morning.", "T", ""],
    ],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const L = ["A", "B", "C"];

const CSS = `
body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:0 auto;padding:24px 18px;color:#222;line-height:1.7;font-size:19px;background:#fffdf7}
h1{text-align:center;color:#c0392b;border-bottom:4px solid #f39c12;padding-bottom:10px}
h2{background:#2e86c1;color:#fff;padding:10px 14px;border-radius:10px;margin-top:36px}
h3{color:#1a5276;margin-top:26px}
.name{display:flex;gap:30px;margin:12px 0}
.tip{background:#fef9e7;border:2px dashed #f39c12;border-radius:12px;padding:8px 16px;margin:12px 0}
.tip ul{margin:6px 0}
.words{font-weight:600;color:#1a5276}
.line{border-bottom:1px dotted #777;height:30px}
.opts{display:flex;gap:26px;flex-wrap:wrap;margin-left:24px}
.dlg{background:#fff;border:2px solid #d6eaf8;border-radius:12px;padding:8px 16px}
.dlg p{margin:4px 0}
.q{margin:8px 0}
.ans{font-weight:700;color:#c0392b}
.note{color:#555;font-size:16px}
ol li{margin:12px 0}
@media print{body{font-size:15px;background:#fff} h2,h3{break-after:avoid} li,.dlg{break-inside:avoid}}
`;

function page(title, body) {
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style></head><body>${body}</body></html>`;
}

// ---------- FILE ĐỀ ----------
let de = `<h1>ENGLISH – GRADE 3<br>Bộ đề: like, favourite, have to / has to, do / does</h1>
<div class="name"><span>Name: ______________________</span><span>Class: ________</span><span>Date: ___________</span></div>
<div class="tip"><b>Ghi nhớ nhanh:</b>
<ul>
<li><b>I / You / We / They</b> + like → <i>I like cats.</i> &nbsp; <b>He / She / It / tên riêng</b> + like<b>s</b> → <i>She likes cats.</i></li>
<li>Sau <b>like</b> có thể dùng <b>V-ing</b>: <i>I like playing football.</i></li>
<li><b>Do / Does</b> đặt đầu câu hỏi: <i>Do you like fish? – Does she like fish?</i> Sau do / does dùng động từ nguyên mẫu (không thêm s).</li>
<li>Phủ định: <i>I do not (don't) like…</i> / <i>She does not (doesn't) like…</i></li>
<li><b>favourite</b> = yêu thích nhất: <i>My favourite colour is blue.</i></li>
<li><b>have to / has to</b> = phải làm gì: <i>I / You / We / They <b>have to</b> …</i>; <i>He / She / Tom <b>has to</b> …</i></li>
<li>Động từ thêm <b>es</b> sau: -s, -sh, -ch, -x, -o (<i>watches, washes, goes</i>). Động từ tận cùng phụ âm + y đổi <i>y → ies</i> (<i>studies</i>).</li>
</ul></div>`;

de += `<h2>Part 1. Reorder the words (Sắp xếp các từ thành câu đúng) – 15 câu</h2>
<p class="note">Viết hoa chữ cái đầu câu và thêm dấu chấm (.) hoặc dấu hỏi (?) ở cuối câu.</p><ol>`;
for (const [w] of p1) de += `<li><span class="words">${esc(w)}</span><div class="line"></div></li>`;
de += `</ol>`;

de += `<h2>Part 2. Choose the correct answer (Khoanh tròn đáp án đúng) – 20 câu</h2><ol>`;
for (const [q, o] of p2) {
  de += `<li>${esc(q)}<div class="opts">${o.map((x, i) => `<span>${L[i]}. ${esc(x)}</span>`).join("")}</div></li>`;
}
de += `</ol>`;

de += `<h2>Part 3. Read and write True (T) or False (F) (Đọc hội thoại, viết T hoặc F) – 15 câu</h2>`;
let n = 1;
for (const d of p3) {
  de += `<h3>${d.title}</h3><div class="dlg">${d.lines.map((x) => `<p>${esc(x)}</p>`).join("")}</div>`;
  for (const [q] of d.q) de += `<div class="q">${n++}. ${esc(q)} &nbsp; <b>____</b></div>`;
}
de += `<p style="text-align:center;margin-top:30px"><b>– The end –  Good luck! –</b></p>`;

// ---------- FILE ĐÁP ÁN ----------
let da = `<h1>ĐÁP ÁN – Bộ đề like, favourite, have to / has to, do / does</h1>
<div class="tip">Em hãy làm bài xong rồi mới xem đáp án nhé!</div>`;
da += `<h2>Part 1. Reorder the words</h2><ol>`;
for (const [w, a] of p1) da += `<li><span class="ans">${esc(a)}</span></li>`;
da += `</ol><h2>Part 2. Multiple choice</h2><ol>`;
p2.forEach(([q, o, k]) => {
  da += `<li>${esc(q.replace("___", o[k]))} &nbsp;→&nbsp; <span class="ans">${L[k]}</span></li>`;
});
da += `</ol><h2>Part 3. True / False</h2>`;
n = 1;
for (const d of p3) {
  da += `<h3>${d.title}</h3><ol start="${n}">`;
  for (const [q, a, why] of d.q) {
    da += `<li>${esc(q)} &nbsp;→&nbsp; <span class="ans">${a}</span>${why ? ` <span class="note">(${esc(why)})</span>` : ""}</li>`;
    n++;
  }
  da += `</ol>`;
}

const out = __dirname;
fs.writeFileSync(path.join(out, "Bo_de_Tieng_Anh_Lop3.html"), page("Bo de Tieng Anh lop 3", de), "utf8");
fs.writeFileSync(path.join(out, "Dap_an_Bo_de_Tieng_Anh_Lop3.html"), page("Dap an Bo de Tieng Anh lop 3", da), "utf8");
console.log("ok", p1.length, p2.length, p3.reduce((s, d) => s + d.q.length, 0));

module.exports = { p1, p2, p3 };
