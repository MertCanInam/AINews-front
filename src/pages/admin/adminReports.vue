<template>
  <section class="admin-reports-page">
    <h1 class="page-title">📈 Yönetim Raporları</h1>

    <div class="reports-grid">
      <!-- Tam Genişlik Kartlar -->
      <div class="card full-width-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-chart-simple icon"></i> Günlük Haber Sayısı</h2>
          <div class="filter-group">
            <label for="daily-limit">Gün:</label>
            <select id="daily-limit" v-model.number="dailyLimit">
              <option :value="7">7</option>
              <option :value="14">14</option>
              <option :value="30">30</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="dailyPostsRef" v-show="dailyPosts.length > 0"></canvas>
          <p v-if="!dailyPosts.length" class="empty-message">Veri bulunamadı.</p>
        </div>
      </div>

      <!-- İki Sütunlu Grid -->
      <div class="half-width-grid">
        <div class="card">
          <div class="card-header">
            <h2><i class="fa-solid fa-globe icon"></i> Kaynak Bazlı Dağılım</h2>
          </div>
          <div class="chart-container">
            <canvas ref="sourcesRef" v-show="sourcesDist.length > 0"></canvas>
            <p v-if="!sourcesDist.length" class="empty-message">Veri bulunamadı.</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h2><i class="fa-solid fa-user-plus icon"></i> Aylık Kullanıcı Artışı</h2>
          </div>
          <div class="chart-container">
            <canvas ref="growthRef" v-show="monthlyGrowth.length > 0"></canvas>
            <p v-if="!monthlyGrowth.length" class="empty-message">Veri bulunamadı.</p>
          </div>
        </div>
      </div>
      
      <!-- Tam Genişlik Kartlar -->
      <div class="card full-width-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-ticket icon"></i> En Çok Ticket Açanlar</h2>
          <div class="filter-group">
            <label for="ticket-limit">Adet:</label>
            <select id="ticket-limit" v-model.number="topTicketLimit">
              <option :value="5">5</option>
              <option :value="10">10</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="topTicketsRef" v-show="topTicketCreators.length > 0"></canvas>
          <p v-if="!topTicketCreators.length" class="empty-message">Veri bulunamadı.</p>
        </div>
      </div>

      <div class="card full-width-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-fire icon"></i> En Aktif Kullanıcılar</h2>
           <div class="filter-group">
            <label for="active-limit">Adet:</label>
            <select id="active-limit" v-model.number="activeUsersLimit">
              <option :value="5">5</option>
              <option :value="10">10</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="activeUsersRef" v-show="mostActiveUsers.length > 0"></canvas>
           <p v-if="!mostActiveUsers.length" class="empty-message">Veri bulunamadı.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import Chart from "chart.js/auto";
import {
  getDailyPostTrends,
  getPostDistributionBySource,
  getMonthlyUserGrowth,
  getTopTicketCreators,
  getMostActiveUsers,
} from "@/api/admin/adminReportService";

// Refs
const dailyPostsRef = ref(null);
const sourcesRef = ref(null);
const growthRef = ref(null);
const topTicketsRef = ref(null);
const activeUsersRef = ref(null);

// State
const dailyPosts = ref([]);
const sourcesDist = ref([]);
const monthlyGrowth = ref([]);
const topTicketCreators = ref([]);
const mostActiveUsers = ref([]);

// Limits
const dailyLimit = ref(7);
const topTicketLimit = ref(5);
const activeUsersLimit = ref(5);

// Watchers: Filtre değişikliklerini izler ve ilgili fonksiyonu çağırır
watch(dailyLimit, () => renderDailyPosts());
watch(topTicketLimit, () => renderTopTickets());
watch(activeUsersLimit, () => renderActiveUsers());

// Charts
let charts = {};

// Helpers
const parseIntSafe = (v) => {
  const n = typeof v === "string" ? parseInt(v, 10) : Number(v ?? 0);
  return isNaN(n) ? 0 : n;
};
const fmtDate = (d) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("tr-TR", {
        month: "short",
        day: "2-digit",
      })
    : "Bilinmiyor";
const fmtMonth = (d) =>
  d
    ? new Date(d).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "short",
      })
    : "Bilinmiyor";

// Common chart options
function getChartOptions(isBarHorizontal = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isBarHorizontal ? 'y' : 'x',
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#333", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#333", precision: 0, font: { size: 12 } },
      },
    },
  };
}

// ---- Renderers ----
async function renderDailyPosts() {
  try {
    const data = await getDailyPostTrends(dailyLimit.value);
    dailyPosts.value = Array.isArray(data) ? data : [];
    if (charts.daily) charts.daily.destroy();
    if (!dailyPosts.value.length || !dailyPostsRef.value) return;

    await nextTick();
    charts.daily = new Chart(dailyPostsRef.value, {
      type: "bar",
      data: {
        labels: dailyPosts.value.map((d) => fmtDate(d.date)),
        datasets: [{
          label: "Haber Sayısı",
          data: dailyPosts.value.map((d) => parseIntSafe(d.count)),
          backgroundColor: "#4facfe",
          borderRadius: 4,
        }],
      },
      options: getChartOptions(),
    });
  } catch(e) { console.error("Günlük haber trendi alınamadı:", e); }
}

async function renderSourceDist() {
  try {
    const data = await getPostDistributionBySource();
    sourcesDist.value = (Array.isArray(data) ? data : []).map((s) => ({
      name: s["Source.name"] || s.Source?.name || `Kaynak #${s.source_id}`,
      count: parseIntSafe(s.count),
    }));
    if (charts.sources) charts.sources.destroy();
    if (!sourcesDist.value.length || !sourcesRef.value) return;
    
    await nextTick();
    charts.sources = new Chart(sourcesRef.value, {
      type: "doughnut",
      data: {
        labels: sourcesDist.value.map((s) => s.name),
        datasets: [{
          label: "Haber Sayısı",
          data: sourcesDist.value.map((s) => s.count),
          backgroundColor: ['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#f43f5e', '#64748b'],
        }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}},
    });
  } catch(e) { console.error("Kaynak dağılımı alınamadı:", e); }
}

async function renderMonthlyGrowth() {
  try {
    const data = await getMonthlyUserGrowth();
    monthlyGrowth.value = Array.isArray(data) ? data : [];
    if (charts.growth) charts.growth.destroy();
    if (!monthlyGrowth.value.length || !growthRef.value) return;

    await nextTick();
    charts.growth = new Chart(growthRef.value, {
      type: "line",
      data: {
        labels: monthlyGrowth.value.map((g) => (g.month ? fmtMonth(g.month) : "Bilinmiyor")),
        datasets: [{
          label: "Yeni Kullanıcılar",
          data: monthlyGrowth.value.map((g) => parseIntSafe(g.count)),
          borderColor: "#8bc34a",
          backgroundColor: "rgba(139, 195, 74, 0.1)",
          fill: true,
          tension: 0.3,
        }],
      },
      options: getChartOptions(),
    });
  } catch(e) { console.error("Aylık kullanıcı artışı alınamadı:", e); }
}

async function renderTopTickets() {
  try {
    const data = await getTopTicketCreators(topTicketLimit.value);
    topTicketCreators.value = Array.isArray(data) ? data : [];
    if (charts.topTickets) charts.topTickets.destroy();
    if (!topTicketCreators.value.length || !topTicketsRef.value) return;

    await nextTick();
    charts.topTickets = new Chart(topTicketsRef.value, {
      type: "bar",
      data: {
        labels: topTicketCreators.value.map((t) => `${t["User.first_name"] || ""} ${t["User.last_name"] || ""}`.trim()),
        datasets: [{
          label: "Ticket Sayısı",
          data: topTicketCreators.value.map((t) => parseIntSafe(t.ticketCount)),
          backgroundColor: "#ffcd56",
          borderRadius: 4,
        }],
      },
      options: getChartOptions(),
    });
  } catch(e) { console.error("En çok ticket açanlar alınamadı:", e); }
}

async function renderActiveUsers() {
  try {
    const data = await getMostActiveUsers(activeUsersLimit.value);
    mostActiveUsers.value = Array.isArray(data) ? data : [];
    if (charts.activeUsers) charts.activeUsers.destroy();
    if (!mostActiveUsers.value.length || !activeUsersRef.value) return;

    await nextTick();
    charts.activeUsers = new Chart(activeUsersRef.value, {
      type: "bar",
      data: {
        labels: mostActiveUsers.value.map((u) => `${u.first_name || ""} ${u.last_name || ""}`.trim()),
        datasets: [{
          label: "Aktivite Skoru",
          data: mostActiveUsers.value.map((u) => parseIntSafe(u.activityScore)),
          backgroundColor: "#ff5f5f",
          borderRadius: 4,
        }],
      },
      options: getChartOptions(),
    });
  } catch(e) { console.error("En aktif kullanıcılar alınamadı:", e); }
}

// Lifecycle
onMounted(() => {
  // onMounted'da sadece bir kerelik yükleme yapılır
  renderDailyPosts();
  renderSourceDist();
  renderMonthlyGrowth();
  renderTopTickets();
  renderActiveUsers();
});

onBeforeUnmount(() => {
  Object.values(charts).forEach((c) => c && c.destroy());
});
</script>

<style scoped>
.admin-reports-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

/* Raporlar Grid */
.reports-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.half-width-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* Kart Stilleri */
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
}
.card-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.icon {
  color: #6b7280;
}

/* Filtreleme */
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

/* Grafik Alanı */
.chart-container {
  position: relative;
  height: 320px;
  display: flex; /* Eklendi */
  align-items: center; /* Eklendi */
  justify-content: center; /* Eklendi */
}
.empty-message {
  color: #6b7280;
  font-style: italic;
}

/* Responsive */
@media (min-width: 768px) {
  .half-width-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

