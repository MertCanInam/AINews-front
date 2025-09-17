<template>
  <section class="admin-reports">
    <h1>📊 Yönetim Raporları</h1>

    <!-- 1) Günlük çekilen haber sayısı -->
    <div class="card">
      <div class="card-head">
        <h2>📰 Günlük Haber Sayısı</h2>
        <div class="right">
          <label class="limit-label">Gün: </label>
          <select v-model.number="dailyLimit" @change="renderDailyPosts">
            <option :value="7">7</option>
            <option :value="14">14</option>
            <option :value="30">30</option>
          </select>
        </div>
      </div>
      <div class="chart-wrap" v-if="dailyPosts.length">
        <canvas ref="dailyPostsRef"></canvas>
      </div>
      <p v-else class="muted">Veri bulunamadı.</p>
    </div>

    <!-- 2) Kaynak başına haber dağılımı -->
    <div class="card">
      <h2>🌐 Kaynak Bazlı Haber Dağılımı</h2>
      <div class="chart-wrap" v-if="sourcesDist.length">
        <canvas ref="sourcesRef"></canvas>
      </div>
      <p v-else class="muted">Veri bulunamadı.</p>
    </div>

    <!-- 3) Aylık kullanıcı artışı -->
    <div class="card">
      <h2>👥 Aylık Kullanıcı Artışı</h2>
      <div class="chart-wrap" v-if="monthlyGrowth.length">
        <canvas ref="growthRef"></canvas>
      </div>
      <p v-else class="muted">Veri bulunamadı.</p>
    </div>

    <!-- 4) En çok ticket açan kullanıcılar -->
    <div class="card">
      <div class="card-head">
        <h2>🎟️ En Çok Ticket Açanlar</h2>
        <div class="right">
          <label class="limit-label">Adet: </label>
          <select v-model.number="topTicketLimit" @change="renderTopTickets">
            <option :value="5">5</option>
            <option :value="10">10</option>
          </select>
        </div>
      </div>
      <div class="chart-wrap" v-if="topTicketCreators.length">
        <canvas ref="topTicketsRef"></canvas>
      </div>
      <p v-else class="muted">Veri bulunamadı.</p>
    </div>

    <!-- 5) En aktif kullanıcılar -->
    <div class="card">
      <div class="card-head">
        <h2>🔥 En Aktif Kullanıcılar</h2>
        <div class="right">
          <label class="limit-label">Adet: </label>
          <select v-model.number="activeUsersLimit" @change="renderActiveUsers">
            <option :value="5">5</option>
            <option :value="10">10</option>
          </select>
        </div>
      </div>
      <div class="chart-wrap" v-if="mostActiveUsers.length">
        <canvas ref="activeUsersRef"></canvas>
      </div>
      <p v-else class="muted">Veri bulunamadı.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
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

// Limits (default seçili)
const dailyLimit = ref(7);
const topTicketLimit = ref(5);
const activeUsersLimit = ref(5);

// Charts
let dailyChart, sourcesChart, growthChart, topTicketsChart, activeUsersChart;

// Helpers
const parseIntSafe = (v) => {
  const n = typeof v === "string" ? parseInt(v, 10) : Number(v ?? 0);
  return isNaN(n) ? 0 : n;
};
const fmtDate = (d) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("tr-TR", {
        year: "numeric",
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

// Common options
function barOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#333", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { color: "#333", precision: 0, font: { size: 12 } },
      },
    },
  };
}

// ---- Renderers ----
async function renderDailyPosts() {
  const data = await getDailyPostTrends(dailyLimit.value);
  dailyPosts.value = Array.isArray(data) ? data : [];

  if (dailyChart) { dailyChart.destroy(); dailyChart = null; }
  if (!dailyPosts.value.length) return;

  await nextTick();
  if (!dailyPostsRef.value) return;

  const labels = dailyPosts.value.map((d) => fmtDate(d.date));
  const counts = dailyPosts.value.map((d) => parseIntSafe(d.count));

  dailyChart = new Chart(dailyPostsRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Haber Sayısı",
          data: counts,
          backgroundColor: "#4facfe",
          borderColor: "#00f2fe",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: barOptions(),
  });
}

async function renderSourceDist() {
  const data = await getPostDistributionBySource();
  sourcesDist.value = (Array.isArray(data) ? data : []).map((s) => ({
    name: s["Source.name"] || s.Source?.name || `Kaynak #${s.source_id}`,
    count: parseIntSafe(s.count),
  }));

  if (sourcesChart) { sourcesChart.destroy(); sourcesChart = null; }
  if (!sourcesDist.value.length) return;

  await nextTick();
  if (!sourcesRef.value) return;

  sourcesChart = new Chart(sourcesRef.value, {
    type: "bar",
    data: {
      labels: sourcesDist.value.map((s) => s.name),
      datasets: [
        {
          label: "Haber Sayısı",
          data: sourcesDist.value.map((s) => s.count),
          backgroundColor: "#00f2fe",
          borderColor: "#4facfe",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: barOptions(),
  });
}

async function renderMonthlyGrowth() {
  const data = await getMonthlyUserGrowth();
  monthlyGrowth.value = Array.isArray(data) ? data : [];

  if (growthChart) { growthChart.destroy(); growthChart = null; }
  if (!monthlyGrowth.value.length) return;

  await nextTick();
  if (!growthRef.value) return;

  const labels = monthlyGrowth.value.map((g) => (g.month ? fmtMonth(g.month) : "Bilinmiyor"));
  const counts = monthlyGrowth.value.map((g) => parseIntSafe(g.count));

  growthChart = new Chart(growthRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Yeni Kullanıcılar",
          data: counts,
          backgroundColor: "#8bc34a",
          borderColor: "#4caf50",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: barOptions(),
  });
}

async function renderTopTickets() {
  const data = await getTopTicketCreators(topTicketLimit.value);
  topTicketCreators.value = Array.isArray(data) ? data : [];

  if (topTicketsChart) { topTicketsChart.destroy(); topTicketsChart = null; }
  if (!topTicketCreators.value.length) return;

  await nextTick();
  if (!topTicketsRef.value) return;

  const labels = topTicketCreators.value.map((t) => {
    const fn = t["User.first_name"] || "";
    const ln = t["User.last_name"] || "";
    return `${fn} ${ln}`.trim() || "Bilinmiyor";
  });
  const counts = topTicketCreators.value.map((t) => parseIntSafe(t.ticketCount));

  topTicketsChart = new Chart(topTicketsRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Ticket Sayısı",
          data: counts,
          backgroundColor: "#ffcd56",
          borderColor: "#ffb300",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: barOptions(),
  });
}

async function renderActiveUsers() {
  const data = await getMostActiveUsers(activeUsersLimit.value);
  mostActiveUsers.value = Array.isArray(data) ? data : [];

  if (activeUsersChart) { activeUsersChart.destroy(); activeUsersChart = null; }
  if (!mostActiveUsers.value.length) return;

  await nextTick();
  if (!activeUsersRef.value) return;

  const labels = mostActiveUsers.value.map((u) =>
    `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Bilinmiyor"
  );
  const scores = mostActiveUsers.value.map((u) => parseIntSafe(u.activityScore));

  activeUsersChart = new Chart(activeUsersRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Aktivite Skoru",
          data: scores,
          backgroundColor: "#ff5f5f",
          borderColor: "#e84141",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: barOptions(),
  });
}

// Lifecycle
onMounted(async () => {
  await nextTick();
  await renderDailyPosts();
  await renderSourceDist();
  await renderMonthlyGrowth();
  await renderTopTickets();
  await renderActiveUsers();
});

onBeforeUnmount(() => {
  [dailyChart, sourcesChart, growthChart, topTicketsChart, activeUsersChart]
    .forEach((c) => c && c.destroy());
});
</script>

<style scoped>
.admin-reports {
  padding: 20px;
  margin-top: 40px;
  display: grid;
  gap: 24px;
}
.card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 18px 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.limit-label {
  margin-right: 8px;
  font-weight: 600;
}
.card select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
}
.chart-wrap {
  position: relative;
  height: 320px;
}
.muted {
  color: #888;
  font-size: 14px;
  margin: 8px 0 12px;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .admin-reports {
    padding: 15px;
    gap: 20px;
  }
  .card {
    padding: 14px 14px 6px;
  }
  .chart-wrap {
    height: 260px;
  }
  .card-head h2 {
    font-size: 16px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .admin-reports {
    padding: 10px;
    gap: 16px;
  }
  .card {
    padding: 12px 12px 6px;
  }
  .chart-wrap {
    height: 220px;
  }
  .card-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .card-head h2 {
    font-size: 15px;
  }
  .card select {
    padding: 5px 8px;
    font-size: 14px;
  }
  .muted {
    font-size: 13px;
  }
}
</style>
