<header class="topbar">
    <div class="tb-left">
        <button class="menu-btn" onclick="toggleSidebar()">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="tb-search">
            <span class="material-symbols-outlined">search</span>
            <input id="searchInput" type="text" placeholder="Cari mahasiswa, jurusan, mata kuliah… (Ctrl K)" oninput="if(typeof onSearch==='function') onSearch(this.value)" />
        </div>
    </div>
</header>