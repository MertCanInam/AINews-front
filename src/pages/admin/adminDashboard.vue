<template>
  <section class="admin-dashboard">
    <h1 class="page-title">📊 Admin Dashboard</h1>

    <div v-if="stats" class="dashboard-content">
      <!-- Üst Sıra: Ana İstatistik Kartları -->
      <div class="top-stats-grid">
        <div class="stat-card users-card">
          <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
          <div class="stat-info">
            <h2>Kullanıcılar</h2>
            <p>{{ stats.totalUsers }}</p>
          </div>
        </div>
        <div class="stat-card posts-card">
          <div class="stat-icon"><i class="fa-solid fa-newspaper"></i></div>
          <div class="stat-info">
            <h2>Postlar</h2>
            <p>{{ stats.totalPosts }}</p>
          </div>
        </div>
        <div class="stat-card sources-card">
          <div class="stat-icon"><i class="fa-solid fa-globe"></i></div>
          <div class="stat-info">
            <h2>Kaynaklar</h2>
            <p>{{ stats.totalSources }}</p>
          </div>
        </div>
        <div class="stat-card tickets-card">
          <div class="stat-icon"><i class="fa-solid fa-ticket"></i></div>
          <div class="stat-info">
            <h2>Ticketlar</h2>
            <p>{{ stats.totalTickets }}</p>
          </div>
        </div>
      </div>

      <!-- Ana Grid: İki Sütunlu Yapı -->
      <div class="main-grid">
        <!-- Sol Sütun: Sıralama -->
        <div class="info-card ranking-card">
          <h2>🔥 En Çok Beğenilen Postlar</h2>
          <ol>
            <li v-for="(p, index) in stats.topLikedPosts" :key="p.post_id" :class="`rank-${index + 1}`">
              <a :href="p.source_url" target="_blank" rel="noopener noreferrer" class="rank-link">
                <span class="rank-number">#{{ index + 1 }}</span>
                <div class="rank-info">
                  <h3>{{ p.title }}</h3>
                  <p>{{ p.likeCount }} beğeni</p>
                </div>
              </a>
            </li>
          </ol>
        </div>

        <!-- Sağ Sütun: Ticket Durumu & Son Çekme -->
        <div class="right-column">
          <div class="info-card ticket-status-card">
            <h2>🎟️ Ticket Durumları</h2>
            <ul>
              <li>
                <span><span class="dot open"></span> Açık</span>
                <span class="status-count">{{ stats.ticketStatus.open }}</span>
              </li>
              <li>
                <span><span class="dot read"></span> Okundu</span>
                <span class="status-count">{{ stats.ticketStatus.read }}</span>
              </li>
              <li>
                <span><span class="dot closed"></span> Kapatıldı</span>
                <span class="status-count">{{ stats.ticketStatus.closed }}</span>
              </li>
            </ul>
          </div>
          <div class="info-card last-fetch-card">
            <h2>⏰ Son Haber Çekme</h2>
            <p class="last-fetch-date">{{ formatDate(stats.lastPostDate) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-message">Yükleniyor...</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getDashboardStats } from "@/api/admin/adminDashboardService";

const stats = ref(null);

async function fetchStats() {
  try {
    const { data } = await getDashboardStats();
    stats.value = data;
  } catch (error) {
    console.error("Dashboard verileri alınamadı:", error);
  }
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 1.875rem; /* 30px */
  font-weight: 800;
  color: #111827;
}

.loading-message {
  text-align: center;
  font-weight: 600;
  color: #3b82f6;
  padding: 2rem;
}

/* Yeni Yerleşim Konteynerleri */
.top-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobil için tek sütun */
  gap: 1.5rem;
  margin-top: 1rem;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Yeniden Tasarlanan İstatistik Kartları */
.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
.stat-icon {
  font-size: 2.25rem; /* 36px */
  opacity: 0.8;
}
.stat-info h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}
.stat-info p {
  margin: 0.25rem 0 0 0;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}
.users-card { background: linear-gradient(135deg, #42a5f5, #1e88e5); }
.posts-card { background: linear-gradient(135deg, #ff9800, #fb8c00); }
.sources-card { background: linear-gradient(135deg, #4caf50, #43a047); }
.tickets-card { background: linear-gradient(135deg, #f44336, #e53935); }

/* Genel Bilgi Kartları (Beyaz Arkaplan) */
.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
.info-card h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
}

/* Yeniden Tasarlanan Sıralama Kartı */
.ranking-card ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.rank-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
  border: 1px solid #e5e7eb;
}
.rank-link:hover {
  background-color: #f9fafb;
}
.rank-number {
  font-weight: 800;
  font-size: 1rem;
  color: #6b7280;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f3f4f6;
  flex-shrink: 0;
}
li.rank-1 .rank-number { background-color: #fef3c7; color: #ca8a04; }
li.rank-2 .rank-number { background-color: #e5e7eb; color: #4b5563; }
li.rank-3 .rank-number { background-color: #ffedd5; color: #c2410c; }
.rank-info h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}
.rank-info p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

/* Yeniden Tasarlanan Ticket Durumları Kartı */
.ticket-status-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.ticket-status-card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ticket-status-card li > span:first-child {
  display: flex;
  align-items: center;
  font-weight: 500;
}
.status-count {
  font-weight: 700;
  font-size: 1.1rem;
  color: #374151;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.75rem;
}
.dot.open { background: #3b82f6; }
.dot.read { background: #f59e0b; }
.dot.closed { background: #22c55e; }

/* Son Haber Çekme Kartı */
.last-fetch-card .last-fetch-date {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
}

/* Responsive Düzenlemeler */
@media (min-width: 992px) {
  .main-grid {
    grid-template-columns: 2fr 1fr; /* 2/3 ve 1/3 oranında iki sütun */
  }
}
</style>

