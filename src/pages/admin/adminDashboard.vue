<template>
  <section class="admin-dashboard">
    <h1>📊 Admin Dashboard</h1>

    <div v-if="stats" class="stats-grid">
      <!-- Genel Sayılar -->
      <div class="stat-card users">
        <div>
          <h2>👥 Kullanıcılar</h2>
          <p>{{ stats.totalUsers }}</p>
        </div>
      </div>
      <div class="stat-card posts">
        <div>
          <h2>📰 Postlar</h2>
          <p>{{ stats.totalPosts }}</p>
        </div>
      </div>
      <div class="stat-card sources">
        <div>
          <h2>🌐 Kaynaklar</h2>
          <p>{{ stats.totalSources }}</p>
        </div>
      </div>
      <div class="stat-card tickets">
        <div>
          <h2>🎫 Ticketlar</h2>
          <p>{{ stats.totalTickets }}</p>
        </div>
      </div>

      <!-- Ticket Durumları -->
      <div class="card span-2 ticket-status">
        <h2>🎟️ Ticket Durumları</h2>
        <ul>
          <li><span class="dot open"></span> Açık: {{ stats.ticketStatus.open }}</li>
          <li><span class="dot read"></span> Okundu: {{ stats.ticketStatus.read }}</li>
          <li><span class="dot closed"></span> Kapatıldı: {{ stats.ticketStatus.closed }}</li>
        </ul>
      </div>

      <!-- En Çok Beğenilen Postlar -->
      <div class="card span-2 ranking-card">
        <h2>🔥 En Çok Beğenilen Postlar</h2>
        <ol>
          <li
            v-for="(p, index) in stats.topLikedPosts"
            :key="p.post_id"
            :class="'rank-' + (index + 1)"
          >
            <a
              :href="p.source_url"
              target="_blank"
              rel="noopener noreferrer"
              class="rank-link"
            >
              <span class="rank">#{{ index + 1 }}</span>
              <div class="info">
                <h3>{{ p.title }}</h3>
                <p>{{ p.likeCount }} beğeni</p>
              </div>
            </a>
          </li>
        </ol>
      </div>

      <!-- Son Haber Çekme -->
      <div class="card span-2">
        <h2>⏰ Son Haber Çekme</h2>
        <p>{{ formatDate(stats.lastPostDate) }}</p>
      </div>
    </div>

    <div v-else class="loading">Yükleniyor...</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getDashboardStats } from "@/api/admin/adminDashboardService";

const stats = ref(null);

async function fetchStats() {
  const { data } = await getDashboardStats();
  stats.value = data;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(fetchStats);
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  margin-top: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
.card h2 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}
.card p {
  font-size: 20px;
  font-weight: bold;
  color: #4facfe;
}
.card ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.card li {
  margin: 6px 0;
  font-size: 14px;
}

.span-2 {
  grid-column: span 2;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

/* 🔥 Stat kartları */
.stat-card {
  border-radius: 16px;
  padding: 20px;
  color: white;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-5px);
}
.stat-card h2 {
  font-size: 16px;
  margin: 0;
}
.stat-card p {
  font-size: 24px;
  margin: 5px 0 0;
}
/* Renkler */
.stat-card.users {
  background: linear-gradient(135deg, #42a5f5, #478ed1);
}
.stat-card.posts {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}
.stat-card.sources {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}
.stat-card.tickets {
  background: linear-gradient(135deg, #e53935, #b71c1c);
}

/* 🔥 Ticket durumları */
.ticket-status li {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 6px 0;
}
.ticket-status .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
.ticket-status .dot.open {
  background: #ff6384;
}
.ticket-status .dot.read {
  background: #36a2eb;
}
.ticket-status .dot.closed {
  background: #4caf50;
}

/* 🔥 Ranking kartları */
.ranking-card li {
  margin-bottom: 8px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
}
.ranking-card li:hover {
  transform: translateX(4px);
}
.ranking-card .rank-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-decoration: none;
  color: inherit;
  background: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.ranking-card .rank {
  font-weight: bold;
  font-size: 18px;
  color: #4facfe;
  width: 40px;
  text-align: center;
}
.ranking-card .info h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
.ranking-card .info p {
  margin: 2px 0 0;
  font-size: 13px;
  color: #666;
}
/* İlk 3 için özel renk */
.ranking-card li.rank-1 .rank-link {
  background: #ffe082;
}
.ranking-card li.rank-2 .rank-link {
  background: #e0e0e0;
}
.ranking-card li.rank-3 .rank-link {
  background: #ffccbc;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .admin-dashboard {
    padding: 15px;
  }
  .card, .stat-card {
    padding: 15px;
  }
  .card h2 {
    font-size: 14px;
  }
  .card p {
    font-size: 18px;
  }
  .span-2 {
    grid-column: span 1; /* Tablet ve küçük cihazlarda tek sütun */
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .admin-dashboard {
    padding: 10px;
  }
  .card, .stat-card {
    padding: 12px;
  }
  .card h2 {
    font-size: 13px;
  }
  .card p {
    font-size: 16px;
  }
  .ranking-card .rank-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .ranking-card .rank {
    width: auto;
    font-size: 16px;
  }
}
</style>
