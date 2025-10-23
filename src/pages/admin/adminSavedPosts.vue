<template>
  <section class="admin-saved-posts-page">
    <h1 class="page-title">💾 Kaydedilen Gönderi Yönetimi</h1>

    <!-- Bütünleşik Kullanıcı Aktivite Kartı -->
    <div class="card">
      <div class="card-header">
        <h2>👤 Kullanıcı Aktivitesi</h2>
      </div>
      <div class="user-search-form">
        <input
          v-model.number="userId"
          type="number"
          placeholder="Kullanıcı ID girin..."
        />
        <button @click="loadUserPosts">
          <i class="fa-solid fa-search"></i> Getir
        </button>
      </div>
      
      <!-- Arama Sonuçları Alanı -->
      <div v-if="searchPerformed" class="search-results">
        <div v-if="userStats" class="results-grid">
          <!-- Sol: İstatistikler -->
          <div class="stats-container">
            <div class="stat-item">
              <span class="stat-label">Toplam Kaydedilen</span>
              <span class="stat-number">{{ userStats.savedPostsCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Kullanıcı ID</span>
              <span class="stat-number">#{{ userStats.userId }}</span>
            </div>
          </div>
          <!-- Sağ: Kaydedilen Post Listesi -->
          <div class="user-posts-list">
            <h3 class="list-title">Kaydedilen Gönderiler</h3>
            <div v-if="userPosts.length > 0" class="list-body">
              <div v-for="post in userPosts" :key="post.post_id" class="user-post-item">
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-date">{{ new Date(post.created_at).toLocaleDateString("tr-TR") }}</p>
              </div>
            </div>
            <p v-else class="empty-message-small">Bu kullanıcıya ait kayıtlı gönderi bulunamadı.</p>
          </div>
        </div>
        <p v-else class="empty-message">Kullanıcı bulunamadı veya bu kullanıcıya ait veri yok.</p>
      </div>
      <p v-else class="empty-message-initial">Lütfen bir kullanıcı ID'si girip arama yapın.</p>
    </div>

    <!-- En Çok Beğenilen Haberler Grafiği -->
    <div class="card chart-card">
      <div class="card-header">
        <h2>🔥 En Çok Beğenilen Haberler</h2>
        <div class="filter-group">
          <label for="top-limit">Limit:</label>
          <select id="top-limit" v-model.number="topLimit" @change="renderTopPosts">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>
      <div class="chart-container">
        <canvas ref="topPostsRef" v-show="topPosts.length > 0"></canvas>
        <p v-if="topPosts.length === 0" class="empty-message">Grafik için veri bulunamadı.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import Chart from "chart.js/auto";
import {
  getTopLikedPosts,
  getUserSavedPosts,
  getUserSavedStats,
} from "@/api/admin/adminSavedPostService";

// Refs
const topPostsRef = ref(null);

// State
const topPosts = ref([]);
const userPosts = ref([]);
const userStats = ref(null);
const searchPerformed = ref(false); // Arama yapılıp yapılmadığını kontrol etmek için

const topLimit = ref(10);
const userId = ref("");

// Chart instance
let topChart;

// Helpers
const parseIntSafe = (v) =>
  typeof v === "string" ? parseInt(v, 10) : Number(v ?? 0);

// ---- RENDERERS ----
async function renderTopPosts() {
  try {
    const data = await getTopLikedPosts(topLimit.value);
    topPosts.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("En beğenilen postlar alınamadı:", error);
    topPosts.value = [];
  }

  if (topChart) {
    topChart.destroy();
    topChart = null;
  }
  if (!topPosts.value.length) return;

  await nextTick();
  if (!topPostsRef.value) return;

  const labels = topPosts.value.map((p) =>
    p.title?.length > 30 ? p.title.slice(0, 30) + "..." : p.title
  );
  const counts = topPosts.value.map((p) => parseIntSafe(p.likeCount));

  topChart = new Chart(topPostsRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Beğeni Sayısı",
          data: counts,
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
}

// Kullanıcının kaydettiği haberler + istatistikler
async function loadUserPosts() {
  if (!userId.value) return;
  searchPerformed.value = true;
  try {
    userPosts.value = await getUserSavedPosts(userId.value);
    userStats.value = await getUserSavedStats(userId.value);
  } catch (error) {
    console.error("Kullanıcı verileri alınamadı:", error);
    userPosts.value = [];
    userStats.value = null;
  }
}

// Lifecycle
onMounted(async () => {
  await renderTopPosts();
});

onBeforeUnmount(() => {
  if (topChart) topChart.destroy();
});
</script>

<style scoped>
.admin-saved-posts-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

/* Ana Kart Stilleri */
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.card-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

/* Kullanıcı Arama Formu */
.user-search-form {
  display: flex;
  gap: 0.5rem;
}
.user-search-form input {
  flex-grow: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}
.user-search-form button {
  background: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Arama Sonuçları */
.search-results {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
.results-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobil */
  gap: 1.5rem;
}

/* İstatistikler Bölümü */
.stats-container {
  display: flex;
  gap: 1rem; /* Yan yana boşluk */
}
.stat-item {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  flex: 1; /* Eşit genişlik */
  text-align: center;
}
.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  display: block;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
}

/* Kullanıcı Post Listesi */
.user-posts-list {
  max-height: 350px;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}
.list-title {
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.user-post-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.user-post-item:last-child {
  border-bottom: none;
}
.post-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}
.post-date {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Grafik Kartı */
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-group label {
  font-weight: 500;
  color: #4b5563;
}
.filter-group select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
}
.chart-container {
  position: relative;
  height: 400px;
}

/* Mesajlar */
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}
.empty-message-initial {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
  font-style: italic;
}
.empty-message-small {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-style: italic;
}

/* Responsive */
@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr; /* Tablette de alt alta daha iyi durur */
  }
}
</style>

