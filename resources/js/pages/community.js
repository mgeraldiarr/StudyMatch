/* ─── StudyMatch Community Logic (Dynamic & Secure) ─── */

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let CHANNELS = window.__INITIAL_CHANNELS__ || [];
let THREADS = window.__INITIAL_THREADS__ || [];
let searchQ = "";
let activeChannel = null;
let currentOpenThreadId = null;

/* ─── Build channel cards ─── */
function renderChannels() {
  const grid = document.getElementById("channelsGrid");
  if (!grid) return;

  grid.innerHTML = CHANNELS.map(
    (c) => `
    <div class="channel-card${activeChannel === c.id ? " active" : ""}" onclick="selectChannel(${c.id})">
      <div class="channel-icon ${c.color || "purple"}"><span class="material-symbols-outlined">${c.icon || "forum"}</span></div>
      <div class="channel-name"># ${escapeHtml(c.name)}</div>
      <div class="channel-desc">${escapeHtml(c.desc)}</div>
      <div class="channel-meta">
        <span class="material-symbols-outlined">people</span>
        <span>${(c.members || 0).toLocaleString()} anggota</span>
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
  if (ch && bar && label) {
    bar.style.display = "flex";
    label.textContent = `Menampilkan thread dari #${ch.name}`;
  }
  renderChannels();
  renderThreads();
  document.querySelector(".thread-list")?.scrollIntoView({ behavior: "smooth" });
}

function clearChannel() {
  activeChannel = null;
  const bar = document.getElementById("channelsBar");
  if (bar) bar.style.display = "none";
  renderChannels();
  renderThreads();
}

/* ─── Build thread items ─── */
function renderThreads() {
  const list = document.getElementById("threadsList");
  if (!list) return;

  let filtered = THREADS.filter((t) => {
    if (activeChannel) {
      const ch = CHANNELS.find((c) => c.id === activeChannel);
      if (ch && t.channel !== ch.name) return false;
    }
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.excerpt && t.excerpt.toLowerCase().includes(q)) ||
      (t.channel && t.channel.toLowerCase().includes(q))
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
        <span class="vote-num" id="vote-num-${t.id}">${t.votes || 0}</span>
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
          <span class="thread-subject"># ${escapeHtml(t.channel)}</span>
          <span class="thread-time">${escapeHtml(t.time)}</span>
        </div>
        <div class="thread-title">${escapeHtml(t.title)}</div>
        <p class="thread-excerpt">${escapeHtml(t.excerpt)}</p>
        <div class="thread-footer">
          <div class="thread-author">
            <div class="author-av"><img src="${escapeHtml(t.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28')}" alt="" /></div>
            <span class="author-name">${escapeHtml(t.author)}</span>
          </div>
          <div class="thread-stat"><span class="material-symbols-outlined">chat</span><span>${t.replies || 0} balasan</span></div>
          <div class="thread-stat"><span class="material-symbols-outlined">visibility</span><span>${t.views || 1} dilihat</span></div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

/* ─── Thread Detail Modal ─── */
async function openThread(id) {
  currentOpenThreadId = id;
  const overlay = document.getElementById("detailOverlay");
  const panel = document.getElementById("detailPanel");
  const titleEl = document.getElementById("detailTitle");
  const body = document.getElementById("detailBody");

  if (overlay) overlay.classList.add("show");
  if (panel) panel.classList.add("show");
  if (titleEl) titleEl.textContent = "Memuat thread…";
  if (body) body.innerHTML = "<p style='padding:2rem;text-align:center;color:var(--text-muted);'>Memuat isi diskusi…</p>";

  try {
    const res = await fetch(`/community/threads/${id}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const t = data.thread;
      if (titleEl) titleEl.textContent = t.title;

      const repliesHtml = (t.replies && t.replies.length > 0)
        ? t.replies.map(r => `
            <div class="reply-item" style="padding: 12px; border-radius: 8px; background: rgba(0,0,0,0.03); margin-top: 10px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <img src="${escapeHtml(r.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28')}" style="width:24px;height:24px;border-radius:50%;" />
                <span style="font-weight:600;font-size:0.875rem;">${escapeHtml(r.author)}</span>
                <span style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(r.time)}</span>
              </div>
              <p style="font-size:0.875rem;margin:0;">${escapeHtml(r.body)}</p>
            </div>
          `).join("")
        : `<p style="color:var(--text-muted);font-size:0.875rem;margin-top:10px;">Belum ada balasan. Jadilah yang pertama menjawab!</p>`;

      if (body) {
        body.innerHTML = `
          <div class="detail-meta">
            <span class="detail-channel"># ${escapeHtml(t.channel)}</span>
            <span class="badge badge-solved${!t.solved ? " badge-hidden" : ""}"><span class="material-symbols-outlined" style="font-size:12px">check_circle</span>Terjawab</span>
            <span class="badge badge-pinned${!t.pinned ? " badge-hidden" : ""}"><span class="material-symbols-outlined" style="font-size:12px">push_pin</span>Dipin</span>
            <span class="detail-time">${escapeHtml(t.time)}</span>
          </div>
          <div class="detail-author">
            <div class="detail-author-av"><img src="${escapeHtml(t.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28')}" alt="" /></div>
            <span class="detail-author-name">${escapeHtml(t.author)}</span>
          </div>
          <div class="detail-body" style="font-size:0.9375rem;line-height:1.6;margin:1rem 0;">${escapeHtml(t.body)}</div>
          
          <hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:1.5rem 0;" />
          
          <h4 style="margin-bottom:0.5rem;font-size:0.9375rem;">Balasan Diskusi</h4>
          <div id="repliesContainer">${repliesHtml}</div>
          
          <form onsubmit="submitReply(event, ${t.id})" style="margin-top:1.5rem;">
            <textarea class="sess-input" id="replyInput" rows="2" placeholder="Tulis balasan atau jawabanmu…" required style="width:100%;margin-bottom:8px;"></textarea>
            <button type="submit" class="btn btn-primary btn-sm">Kirim Balasan</button>
          </form>
        `;
      }
    }
  } catch (err) {
    if (body) body.innerHTML = "<p style='color:red;padding:1rem;'>Gagal memuat thread.</p>";
  }
}

async function submitReply(e, threadId) {
  e.preventDefault();
  const input = document.getElementById("replyInput");
  if (!input) return;
  const body = input.value.trim();
  if (!body) return;

  try {
    const res = await fetch(`/community/threads/${threadId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ body }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      toast("Balasan berhasil dikirim! ✓", "success");
      openThread(threadId); // Refresh replies
    } else {
      toast(data.message || "Gagal mengirim balasan.", "error");
    }
  } catch (err) {
    toast("Terjadi kesalahan jaringan.", "error");
  }
}

async function upvote(e, id) {
  e.stopPropagation();
  try {
    const res = await fetch(`/community/threads/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ direction: 1 }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const el = document.getElementById(`vote-num-${id}`);
      if (el) el.textContent = data.votes;
      const t = THREADS.find((x) => x.id === id);
      if (t) t.votes = data.votes;
      toast("Upvote ditambahkan ✓", "success");
    }
  } catch (err) {}
}

async function downvote(e, id) {
  e.stopPropagation();
  try {
    const res = await fetch(`/community/threads/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ direction: -1 }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const el = document.getElementById(`vote-num-${id}`);
      if (el) el.textContent = data.votes;
      const t = THREADS.find((x) => x.id === id);
      if (t) t.votes = data.votes;
      toast("Downvote dicatat", "info");
    }
  } catch (err) {}
}

function closeThreadDetail() {
  document.getElementById("detailOverlay")?.classList.remove("show");
  document.getElementById("detailPanel")?.classList.remove("show");
}

/* ─── Create Thread Modal ─── */
function createNewThread() {
  document.getElementById("createOverlay")?.classList.add("show");
  document.getElementById("createPanel")?.classList.add("show");
}

function closeCreateThread() {
  document.getElementById("createOverlay")?.classList.remove("show");
  document.getElementById("createPanel")?.classList.remove("show");
  document.getElementById("createForm")?.reset();
}

async function submitNewThread(e) {
  e.preventDefault();
  const title = document.getElementById("threadTitle")?.value.trim();
  const channel = document.getElementById("threadChannel")?.value;
  const body = document.getElementById("threadBody")?.value.trim();
  const btn = document.getElementById("btnSubmitThread");

  if (!title || !channel || !body) {
    toast("Lengkapi semua kolom!", "error");
    return;
  }

  if (btn) btn.disabled = true;

  try {
    const res = await fetch("/community/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ title, channel, body }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      THREADS.unshift(data.thread);
      closeCreateThread();
      renderThreads();
      toast("Thread berhasil dipublikasikan! 🎉", "success");
    } else {
      toast(data.message || "Gagal mempublikasikan thread.", "error");
    }
  } catch (err) {
    toast("Terjadi kesalahan koneksi.", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ─── Search ─── */
function searchThreads(q) {
  searchQ = q.trim();
  renderThreads();
}

// Global exposure
window.renderChannels = renderChannels;
window.renderThreads = renderThreads;
window.searchThreads = searchThreads;
window.openThread = openThread;
window.closeThreadDetail = closeThreadDetail;
window.createNewThread = createNewThread;
window.closeCreateThread = closeCreateThread;
window.submitNewThread = submitNewThread;
window.submitReply = submitReply;
window.selectChannel = selectChannel;
window.clearChannel = clearChannel;
window.upvote = upvote;
window.downvote = downvote;

// Search listener
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => searchThreads(e.target.value));
}

// Init
renderChannels();
renderThreads();
