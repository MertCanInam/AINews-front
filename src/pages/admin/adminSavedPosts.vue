<template>
  <section class="admin-saved">
    <h1>💾 Kaydedilen Gönderiler</h1>

    <!-- 1) En çok beğenilen haberler -->
    <div class="card">
      <div class="card-head">
        <h2>🔥 En Çok Beğenilen Haberler</h2>
        <div class="right">
          <label>Limit: </label>
          <select v-model.number="topLimit" @change="renderTopPosts">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>
      <div class="chart-wrap" v-if="topPosts.length">
        <canvas ref="topPostsRef"></canvas>
      </div>
      <p v-else class="muted">Veri yok</p>
    </div>

    <!-- 2) Kullanıcının kaydettiği haberler -->
    <div class="card">
      <div class="card-head">
        <h2>👤 Kullanıcının Kaydettiği Haberler</h2>
        <div class="right">
          <input
            v-model="userId"
            type="number"
            placeholder="Kullanıcı ID gir"
          />
          <button class="btn" @click="loadUserPosts">Getir</button>
        </div>
      </div>

      <div v-if="userPosts.length" class="post-list">
        <div v-for="post in userPosts" :key="post.post_id" class="post-card">
          <div class="post-info">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-date">
              {{ new Date(post.created_at).toLocaleDateString("tr-TR") }}
            </p>
          </div>
        </div>
      </div>
      <p v-else class="muted">Kullanıcı için veri yok</p>
    </div>

    <!-- 3) Kullanıcı istatistikleri -->
    <div class="card stats-card" v-if="userStats">
      <h2>📊 Kullanıcı Kaydetme İstatistikleri</h2>
      <div class="stats-box">
        <div class="stat">
          <span class="stat-number">{{ userStats.savedPostsCount }}</span>
          <span class="stat-label">Toplam Kaydedilen</span>
        </div>
        <div class="stat">
          <span class="stat-number">#{{ userStats.userId }}</span>
          <span class="stat-label">Kullanıcı ID</span>
        </div>
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

const topLimit = ref(10);
const userId = ref("");

// Chart instance
let topChart;

// Helpers
const parseIntSafe = (v) =>
  typeof v === "string" ? parseInt(v, 10) : Number(v ?? 0);

// ---- RENDERERS ----
async function renderTopPosts() {
  const data = await getTopLikedPosts(topLimit.value);
  topPosts.value = Array.isArray(data) ? data : [];

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
          backgroundColor: "#ff5f5f",
          borderColor: "#e84141",
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
        x: {
          ticks: { color: "#333", font: { size: 12 } },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#333", precision: 0, font: { size: 12 } },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
    },
  });
}

// Kullanıcının kaydettiği haberler + istatistikler
async function loadUserPosts() {
  if (!userId.value) return;
  userPosts.value = await getUserSavedPosts(userId.value);
  userStats.value = await getUserSavedStats(userId.value);
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
.admin-saved {
  padding: 20px;
  margin-top: 40px;
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 10px;
}

.card-head h2 {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart-wrap {
  position: relative;
  height: 320px;
}

.btn {
  background: #4facfe;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn:hover {
  background: #00c6ff;
}

input[type="number"] {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.post-list {
  display: grid;
  gap: 12px;
}

.post-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 14px 18px;
  border: 1px solid #eee;
  transition: 0.2s;
}
.post-card:hover {
  background: #e3f2fd;
  transform: translateY(-2px);
}

.post-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.post-date {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.stats-card {
  text-align: center;
}

.stats-box {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 16px;
}

.stat {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  min-width: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.stat-number {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #4facfe;
}

.stat-label {
  font-size: 13px;
  color: #555;
  margin-top: 6px;
}

.highlight {
  color: #ff5f5f;
  font-weight: bold;
}

.muted {
  color: #888;
  font-size: 14px;
  margin: 8px 0 12px;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .chart-wrap {
    height: 260px;
  }
  .stats-box {
    gap: 20px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .admin-saved {
    padding: 10px;
    gap: 16px;
  }
  .card {
    padding: 14px;
  }
  .chart-wrap {
    height: 220px;
  }
  .card-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .card-head h2 {
    font-size: 16px;
  }
  .card-head .right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  input[type="number"] {
    width: 100%;
  }
  .stats-box {
    flex-direction: column;
    gap: 12px;
  }
  .stat {
    min-width: unset;
    width: 100%;
  }
}
</style>
