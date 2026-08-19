/* ─── Data ─── */
const CONVERSATIONS = [
  {
    id: 1,
    type: "group",
    icon: "architecture",
    color: "purple",
    name: "Advanced Calculus",
    lastMsg: "Julian: Shared the PDF notes...",
    time: "12:45",
    online: 4,
    active: true,
  },
  {
    id: 2,
    type: "group",
    icon: "psychology",
    color: "teal",
    name: "Cognitive Theory",
    lastMsg: "Let's meet at 5 PM tomorrow.",
    time: "Yesterday",
    active: false,
  },
  {
    id: 3,
    type: "dm",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBB8D51RVcHoQW8xs-en3Mv3DQU3vqf00QEDVmPbPhqspJ73V6mVGEKlm3hkcaUoXftISSeNMjLGP0wNRxl_UA4IBVvNWbl05Yc807ZyMhFZoMd_waC2fzK0fReLgCiMZccR21u4-C-ETnzOB21xlPSE69FCQpeef62VkZFrGahLkJP3lmxzaD2SvBmOJILBp1GBke9_DlEW2hNln0mD1qkZa7eVHNdtfNV0d6gG4GtdMoP_W-Clln4RBo6LB1jDDM9OtdpuSzCkvk",
    name: "Elena Fisher",
    lastMsg: "That paper was so difficult!",
    time: "1h",
    online: true,
    active: false,
  },
  {
    id: 4,
    type: "dm",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD84hcgXrtm7GRvIb7EcmgHvu9k1qy6_kUGH84nw3ckO9Jh3QoaxbjREzUhnvpJpkmhyxVI2A_sbdcJrq0x5axCqDgIwBql-EyaCB84xQZAfhjLxdi-iMgK9wB4Gg8QlJlqROCl-YDq57RIkgxQNZJk9QLyzcS8dNaFUMGtLg_jluXyoNqyLoHASUozRi0Qw8GuXrmfhrfvzs1b2YSYX3ClMnQbZw1jL1vChMm9pKyhNqwjTfZuQC8PVdp_gHE2PDh4dMKcdJaReeI",
    name: "Marcus Wright",
    lastMsg: "Ready for the review session?",
    time: "3h",
    online: false,
    active: false,
  },
];

const MESSAGES = [
  {
    from: "Elena",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-VR5XHbtoZrw07_xJp2dOibXlKV1ph4v9h0Ep25o519mGHSP3fYqdoizVuDhH1jDnG0V8QU1BxK_MY1FPunfb7_8DxkYiVzJKe5EyzCLekGkXYCghAQmKjovo71T9ofCZ7Q-P3k2wp1zMtJIvVPWXKM5xG2_Nonug38Ihs4xm_Xh_lG8GY0s8NlEnZDYV_g7zEw0kMX8j0WI_dB6DpyF0hSp26wJXD4LDoTy6z-NL_Ha689QKQM_H5ZD4LwdHFq-rv3Kk7qTzZ0",
    text: "Siapa yang bisa selesaikan soal integral nomor 3 dari Chapter 5?",
    time: "12:40 PM",
    type: "recv",
  },
  {
    from: "Marcus",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABxnHrPg2brF3ts30uuXQ6Kq6XfkRYWajrWEF3yrsnY-ck2qHZroYtB0sA23Vo6WBm-PT3HQnR7Kvxil9UIe2MalanOAlyT_mrYn28kdXohGu9_ZIUdGlidYze-D4FqTalQLeJg0KVHDNa-Aq4g20pe9kATtjAVT1pJ2IerbhaddYLRoiZ8u6c-8HDRc0nNRBy1e57QWtZVAs37YhvwuuodIZ1hZSH97EUW08SHW7md9_68gRB7Sds9ZOWu1_DmyXH892DF1rRgS4",
    text: "Aku udah kerjain bareng Julian, cek file yang aku share",
    time: "12:44 PM",
    type: "recv",
  },
  {
    from: "Me",
    text: "Terima kasih Marcus! Bagian substitusi-nya yang bikin aku stuck",
    time: "12:48 PM",
    type: "sent",
  },
];

let filterQ = "";
let activeConvId = 1;

/* ─── Render convs ─── */
function renderConvs() {
  const list = document.getElementById("convList");
  const q = filterQ.toLowerCase();
  let filtered = CONVERSATIONS.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) || c.lastMsg.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="conv-empty">
      <span class="material-symbols-outlined">search_off</span>
      <span>Tidak ada percakapan yang cocok.</span>
    </div>`;
    return;
  }

  let hasGroups = filtered.some((c) => c.type === "group");
  let hasDms = filtered.some((c) => c.type === "dm");

  list.innerHTML = filtered
    .map((c) => {
      let label = "";
      if (c.type === "group" && hasGroups) {
        hasGroups = false;
        label = `<div class="conv-section-label">Grup Diskusi</div>`;
      } else if (c.type === "dm" && hasDms) {
        hasDms = false;
        label = `<div class="conv-section-label">Pesan Langsung</div>`;
      }
      return label + buildConvItem(c);
    })
    .join("");
}

function buildConvItem(c) {
  return `<div class="conv-item${c.id === activeConvId ? " active" : ""}" onclick="selectConv(${c.id})">
    ${
      c.type === "group"
        ? `<div class="conv-av-icon ${c.color}"><span class="material-symbols-outlined">${c.icon}</span></div>`
        : `<div class="conv-av"><img src="${c.avatar}" alt="" /></div>`
    }
    <div class="conv-info">
      <div class="conv-name">${c.name}</div>
      <div class="conv-msg">${c.lastMsg}</div>
    </div>
    <div class="conv-time">${c.time}</div>
  </div>`;
}

/* ─── Render messages ─── */
function renderMsgs() {
  const area = document.getElementById("msgsArea");
  area.innerHTML = `<div class="date-sep"><div class="date-sep-line"></div><span class="date-sep-text">Hari ini</span><div class="date-sep-line"></div></div>`;
  MESSAGES.forEach((m) => {
    area.innerHTML += `
      <div class="msg-group ${m.type}">
        ${m.type === "recv" ? `<div class="msg-av"><img src="${m.avatar}" alt="" /></div>` : ""}
        <div style="flex:1;${m.type === "sent" ? "display:flex;flex-direction:column;align-items:flex-end" : ""}">
          <div class="msg-bubble">${m.text}</div>
          <div class="msg-info">${m.time} ${m.type === "sent" ? '<span class="material-symbols-outlined" style="font-size:14px">done_all</span>' : ""}</div>
        </div>
      </div>`;
  });
}

/* ─── Actions ─── */
function selectConv(id) {
  activeConvId = id;
  renderConvs();

  const conv = CONVERSATIONS.find((c) => c.id === id);
  if (!conv) return;

  const nameEl = document.getElementById("chatHdrName");
  const statusEl = document.getElementById("chatHdrStatus");
  const avContainer = document.querySelector(".chat-hdr-av");

  nameEl.textContent = conv.name;
  if (conv.type === "group") {
    statusEl.innerHTML = `<span class="status-dot"></span>${conv.online} anggota aktif`;
    avContainer.innerHTML = `<div class="conv-av-icon ${conv.color}" style="width:2.75rem;height:2.75rem;border-radius:9999px"><span class="material-symbols-outlined">${conv.icon}</span></div>`;
  } else {
    statusEl.innerHTML = `<span class="status-dot${conv.online ? "" : " offline"}"></span>${conv.online ? "Online" : "Offline"}`;
    avContainer.innerHTML = `<img src="${conv.avatar}" alt="" />`;
  }

  toast(`Membuka: ${conv.name}`);
  if (window.innerWidth < 900) {
    const panel = document.querySelector(".conv-panel");
    if (panel) panel.classList.remove("show");
  }
}

function filterConvs(q) {
  filterQ = q;
  renderConvs();
}

function sendMessage() {
  const ta = document.getElementById("inputMsg");
  const msg = ta.value.trim();
  if (!msg) return;
  MESSAGES.push({
    from: "Me",
    text: msg,
    time: "Sekarang",
    type: "sent",
  });
  renderMsgs();
  const area = document.getElementById("msgsArea");
  area.scrollTop = area.scrollHeight;
  ta.value = "";
  ta.style.height = "auto";
  toast("Pesan terkirim ✓");
}

/* ─── Auto resize textarea ─── */
document.getElementById("inputMsg").addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 144) + "px";
});

function toggleConvPanel() {
  const panel = document.querySelector(".conv-panel");
  if (panel) panel.classList.toggle("show");
}

/* ── Expose to global for onclick/oninput handlers ── */
window.toggleConvPanel = toggleConvPanel;
window.renderConvs = renderConvs;
window.buildConvItem = buildConvItem;
window.renderMsgs = renderMsgs;
window.selectConv = selectConv;
window.filterConvs = filterConvs;
window.sendMessage = sendMessage;

/* ─── Init ─── */
renderConvs();
renderMsgs();
