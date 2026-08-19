/* ─── Data ─── */
const CHANNELS = [
  {
    id: 1,
    name: "Pemrograman",
    icon: "terminal",
    color: "purple",
    desc: "Python, JavaScript, C++, dan bahasa lain",
    members: 2400,
  },
  {
    id: 2,
    name: "Matematika",
    icon: "calculate",
    color: "teal",
    desc: "Aljabar, Kalkulus, Statistika",
    members: 1900,
  },
  {
    id: 3,
    name: "Sains",
    icon: "science",
    color: "purple",
    desc: "Fisika, Kimia, Biologi",
    members: 1600,
  },
  {
    id: 4,
    name: "Desain",
    icon: "palette",
    color: "teal",
    desc: "UI/UX, Grafis, Fotografi",
    members: 840,
  },
  {
    id: 5,
    name: "Bahasa",
    icon: "language",
    color: "purple",
    desc: "Inggris, Mandarin, Jepang",
    members: 2100,
  },
  {
    id: 6,
    name: "Humaniora",
    icon: "menu_book",
    color: "teal",
    desc: "Sejarah, Sastra, Filsafat",
    members: 950,
  },
];

const THREADS = [
  {
    id: 1,
    channel: "Pemrograman",
    title: "Best practices untuk async/await di JavaScript",
    excerpt:
      "Diskusi mendalam tentang cara menggunakan async/await dengan benar dalam JavaScript modern…",
    author: "Budi Santoso",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8m8h3Kebj96j9Xv-qiL6jydArdiojEWCr7KonLA03vEpzrAwjxQVQw1ypWEfzDb59BBv0yC4jnZ-lSDs2aGS0rFUKTUuW1FOEfCSGzEDqqnMLupAvr2cwH3z96OuRo3hfEZdOKBEy6DLiWFOwEaU5v8sCbkcy_PvKhmYcWFxtMEsmueKmU-SYEIhDbCr1TH067UBxDnMn7I-1KHa16mRWrfdYk-msaeYWbTGWAi6bNqGYNKvT3-Z61SN8R2jUW9-ECTKy0W2CxAM",
    time: "2 jam lalu",
    votes: 24,
    replies: 8,
    views: 156,
    solved: true,
    pinned: false,
  },
  {
    id: 2,
    channel: "Matematika",
    title: "Transformasi Laplace untuk pemula — penjelasan lengkap",
    excerpt:
      "Tutorial step-by-step untuk memahami transformasi Laplace tanpa harus pusing dengan notasi matematis yang rumit…",
    author: "Siti Fatimah",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWhr2UB_6eTLnGupEodi-ZX6N4jeN72NOQxPcrlI5vc3Z4i-FB-axDU1mCgg5wIVt7qoSGC9K-0xHJ33B561NUhkCWB2ZFa8mEnWWLnEb1DuK32XHsfxdh_zR1hlLDLtAFUwmsx-LfaytVgzMyj_Rxchke3tPctsoJQs9xMC-bF4Hcw4LbK0zqY-YJpz3y7Uy4xcKirryI6wbGL3vZp-vuRapnqbg3Vf_ksU2MfyHVnshOESD9ccgkseZH9Wf4TwdWnT7MygCcL-U",
    time: "4 jam lalu",
    votes: 18,
    replies: 5,
    views: 92,
    solved: false,
    pinned: true,
  },
  {
    id: 3,
    channel: "Sains",
    title:
      "Bagaimana cara memahami mekanika kuantum dengan cara yang intuitif?",
    excerpt:
      "Saya kesulitan memahami prinsip-prinsip dasar mekanika kuantum. Adakah yang bisa menjelaskan dengan cara yang lebih mudah dipahami?…",
    author: "Reza Firmansyah",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA",
    time: "6 jam lalu",
    votes: 31,
    replies: 12,
    views: 245,
    solved: false,
    pinned: false,
  },
  {
    id: 4,
    channel: "Desain",
    title: "Tool desain terbaik untuk membuat mockup UI/UX tahun 2024",
    excerpt:
      "Setelah mencoba berbagai tool, ini adalah rekomendasi saya untuk desainer pemula dan profesional…",
    author: "Dewi Kusuma",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28",
    time: "1 hari lalu",
    votes: 42,
    replies: 15,
    views: 380,
    solved: true,
    pinned: false,
  },
];

let searchQ = "";

let activeChannel = null;

/* ─── Build channel cards ─── */
function renderChannels() {
  const grid = document.getElementById("channelsGrid");
  grid.innerHTML = CHANNELS.map(
    (c) => `
    <div class="channel-card${activeChannel === c.id ? " active" : ""}" onclick="selectChannel(${c.id})">
      <div class="channel-icon ${c.color}"><span class="material-symbols-outlined">${c.icon}</span></div>
      <div class="channel-name"># ${c.name}</div>
      <div class="channel-desc">${c.desc}</div>
      <div class="channel-meta">
        <span class="material-symbols-outlined">people</span>
        <span>${c.members.toLocaleString()} anggota</span>
      </div>
    </div>
  `,
  ).join("");
}

function selectChannel(id) {
  activeChannel = id;
  const bar = document.getElementById("channelsBar");
  const label = document.getElementById("channelsBarLabel");
  const ch = CHANNELS.find((c) => c.id === id);
  if (ch) {
    bar.style.display = "flex";
    label.textContent = `Menampilkan thread dari #${ch.name}`;
  }
  renderChannels();
  renderThreads();
  document.querySelector(".thread-list")?.scrollIntoView({ behavior: "smooth" });
}

function clearChannel() {
  activeChannel = null;
  document.getElementById("channelsBar").style.display = "none";
  renderChannels();
  renderThreads();
}

/* ─── Build thread items ─── */
function renderThreads() {
  const list = document.getElementById("threadsList");

  let filtered = THREADS.filter((t) => {
    if (activeChannel) {
      const ch = CHANNELS.find((c) => c.id === activeChannel);
      if (ch && t.channel !== ch.name) return false;
    }
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.excerpt.toLowerCase().includes(q) ||
      t.channel.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem">Tidak ada thread yang cocok dengan pencarian.</p>`;
    return;
  }

  list.innerHTML = filtered
    .map(
      (t) => `
    <div class="thread-item" onclick="openThread(${t.id})">
      <div class="thread-vote">
        <button class="vote-btn up" onclick="upvote(event,${t.id})"><span class="material-symbols-outlined">arrow_upward</span></button>
        <span class="vote-num">${t.votes}</span>
        <button class="vote-btn dn" onclick="downvote(event,${t.id})"><span class="material-symbols-outlined">arrow_downward</span></button>
      </div>
      <div class="thread-body">
        <div class="thread-meta">
          <span class="badge badge-solved${!t.solved ? " badge-hidden" : ""}">
            <span class="material-symbols-outlined" style="font-size:12px">check_circle</span>Terjawab
          </span>
          <span class="badge badge-pinned${!t.pinned ? " badge-hidden" : ""}">
            <span class="material-symbols-outlined" style="font-size:12px">push_pin</span>Dipin
          </span>
          <span class="thread-subject">${t.channel}</span>
          <span class="thread-time">${t.time}</span>
        </div>
        <div class="thread-title">${t.title}</div>
        <p class="thread-excerpt">${t.excerpt}</p>
        <div class="thread-footer">
          <div class="thread-author">
            <div class="author-av"><img src="${t.avatar}" alt="" /></div>
            <span class="author-name">${t.author}</span>
          </div>
          <div class="thread-stat"><span class="material-symbols-outlined">chat</span><span>${t.replies} balasan</span></div>
          <div class="thread-stat"><span class="material-symbols-outlined">visibility</span><span>${t.views} dilihat</span></div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

/* ─── Thread Detail Modal ─── */
function openThread(id) {
  const t = THREADS.find((x) => x.id === id);
  if (!t) return;

  document.getElementById("detailTitle").textContent = t.title;
  document.getElementById("detailOverlay").classList.add("show");
  document.getElementById("detailPanel").classList.add("show");

  const ch = CHANNELS.find((c) => c.name === t.channel);
  const body = document.getElementById("detailBody");
  body.innerHTML = `
    <div class="detail-meta">
      ${ch ? `<span class="detail-channel"># ${ch.name}</span>` : `<span class="detail-channel">${t.channel}</span>`}
      <span class="badge badge-solved${!t.solved ? " badge-hidden" : ""}"><span class="material-symbols-outlined" style="font-size:12px">check_circle</span>Terjawab</span>
      <span class="badge badge-pinned${!t.pinned ? " badge-hidden" : ""}"><span class="material-symbols-outlined" style="font-size:12px">push_pin</span>Dipin</span>
      <span class="detail-time">${t.time}</span>
    </div>
    <div class="detail-author">
      <div class="detail-author-av"><img src="${t.avatar}" alt="" /></div>
      <span class="detail-author-name">${t.author}</span>
    </div>
    <div class="detail-vote">
      <button class="vote-btn up" onclick="detailVote(${t.id},1)"><span class="material-symbols-outlined">arrow_upward</span></button>
      <span class="vote-num" id="detailVoteNum">${t.votes}</span>
      <button class="vote-btn dn" onclick="detailVote(${t.id},-1)"><span class="material-symbols-outlined">arrow_downward</span></button>
    </div>
    <div class="detail-body">${t.excerpt}</div>
    <div class="detail-stats">
      <div class="detail-stat"><span class="material-symbols-outlined">chat</span> ${t.replies} balasan</div>
      <div class="detail-stat"><span class="material-symbols-outlined">visibility</span> ${t.views} dilihat</div>
    </div>
  `;
}

function detailVote(id, dir) {
  const t = THREADS.find((x) => x.id === id);
  if (!t) return;
  t.votes += dir;
  const num = document.getElementById("detailVoteNum");
  if (num) num.textContent = t.votes;
  renderThreads();
}

function closeThreadDetail() {
  document.getElementById("detailOverlay").classList.remove("show");
  document.getElementById("detailPanel").classList.remove("show");
}

/* ─── Create Thread Modal ─── */
let threadIdCounter = 5;

function createNewThread() {
  document.getElementById("createOverlay").classList.add("show");
  document.getElementById("createPanel").classList.add("show");
}

function closeCreateThread() {
  document.getElementById("createOverlay").classList.remove("show");
  document.getElementById("createPanel").classList.remove("show");
  document.getElementById("createForm").reset();
}

function submitNewThread(e) {
  e.preventDefault();
  const title = document.getElementById("threadTitle").value.trim();
  const channel = document.getElementById("threadChannel").value;
  const body = document.getElementById("threadBody").value.trim();
  if (!title || !channel || !body) {
    toast("Lengkapi semua kolom!", "error");
    return;
  }
  THREADS.push({
    id: threadIdCounter++,
    channel,
    title,
    excerpt: body,
    author: "Alya Ramadhani",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA",
    time: "Baru saja",
    votes: 0,
    replies: 0,
    views: 1,
    solved: false,
    pinned: false,
  });
  closeCreateThread();
  renderThreads();
  toast("Thread berhasil dipublikasikan! ✓", "success");
}

/* ─── Actions ─── */
function searchThreads(q) {
  searchQ = q.trim();
  renderThreads();
}

function upvote(e, id) {
  e.stopPropagation();
  const t = THREADS.find((x) => x.id === id);
  t.votes++;
  renderThreads();
  toast("Upvote ditambahkan ✓");
}

function downvote(e, id) {
  e.stopPropagation();
  const t = THREADS.find((x) => x.id === id);
  t.votes--;
  renderThreads();
  toast("Downvote ditambahkan");
}

/* ─── Scroll progress ─── */
window.addEventListener(
  "scroll",
  () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById("prog").style.width =
      h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
  },
  { passive: true },
);

/* ── Expose to global for onclick/oninput handlers ── */
window.renderChannels = renderChannels;
window.renderThreads = renderThreads;
window.searchThreads = searchThreads;
window.openThread = openThread;
window.closeThreadDetail = closeThreadDetail;
window.createNewThread = createNewThread;
window.closeCreateThread = closeCreateThread;
window.submitNewThread = submitNewThread;
window.selectChannel = selectChannel;
window.clearChannel = clearChannel;
window.upvote = upvote;
window.downvote = downvote;
window.detailVote = detailVote;

/* ─── Init ─── */
renderChannels();
renderThreads();
