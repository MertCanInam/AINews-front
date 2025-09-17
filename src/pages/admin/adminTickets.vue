<template>
  <section class="tickets-page">
    <h1>🎟️ Ticket Yönetimi</h1>

    <div v-if="tickets.length" class="tickets-grid">
      <AdminTicketCard 
        v-for="t in tickets" 
        :key="t.id" 
        :ticket="t" 
        :class="['ticket-card', t.status]" 
        @update-status="handleUpdateStatus" 
      />
    </div>
    <p v-else class="empty">Henüz ticket yok.</p>

    <!-- ✅ Pagination -->
    <div v-if="pagination.totalPages > 1" class="pagination">
      <button 
        class="btn-nav"
        :disabled="pagination.currentPage === 1"
        @click="changePage(pagination.currentPage - 1)">
        ⬅️ Önceki
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="btn-page"
        :class="{ active: page === pagination.currentPage }"
        @click="changePage(page)">
        {{ page }}
      </button>

      <button 
        class="btn-nav"
        :disabled="pagination.currentPage === pagination.totalPages"
        @click="changePage(pagination.currentPage + 1)">
        Sonraki ➡️
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllTickets, updateTicketStatus } from "@/api/admin/adminTicketService";
import AdminTicketCard from "@/components/admin/adminTicketCard.vue";

const tickets = ref([]);
const pagination = ref({ total: 0, currentPage: 1, totalPages: 1 });
const maxVisiblePages = 6;

async function fetchTickets(page = 1) {
  try {
    const res = await getAllTickets({ page, limit: 10 });
    tickets.value = res.tickets || [];
    pagination.value = {
      total: res.total,
      currentPage: res.currentPage,
      totalPages: res.totalPages,
    };
  } catch (err) {
    console.error("Ticketlar alınamadı:", err);
  }
}

function changePage(page) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchTickets(page);
  }
}

const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const current = pagination.value.currentPage;
  if (total <= maxVisiblePages) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 5, 6];
  }
  if (current >= total - 2) {
    return Array.from({ length: 6 }, (_, i) => total - 5 + i);
  }
  return Array.from({ length: 6 }, (_, i) => current - 2 + i);
});

async function handleUpdateStatus(id, status) {
  try {
    await updateTicketStatus(id, status);
    fetchTickets(pagination.value.currentPage);
  } catch (err) {
    console.error("Ticket durumu güncellenemedi:", err);
  }
}

onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
.tickets-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 24px;
  margin-top: 80px;
}

.tickets-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.empty {
  text-align: center;
  opacity: 0.7;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}
.btn-nav {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  padding: 8px 16px;
  cursor: pointer;
}
.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-page {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 14px;
  border-radius: 50%;
  cursor: pointer;
}
.btn-page.active {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: bold;
}

/* ✅ Ticket Card */
.ticket-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 16px;
  transition: all 0.25s ease;
}

/* 🔹 Open (Açık) */
.ticket-card.open {
  border: 1px solid #4facfe;
}
.ticket-card.open:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35);
}

/* 🔹 Read (Okundu) */
.ticket-card.read {
  border: 1px solid #ffcd56;
}
.ticket-card.read:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 6px 18px rgba(255, 205, 86, 0.35);
}

/* 🔹 Closed (Kapalı) */
.ticket-card.closed {
  border: 1px solid #ff5f5f;
}
.ticket-card.closed:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 6px 18px rgba(255, 95, 95, 0.35);
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .tickets-page {
    padding: 16px;
    margin-top: 40px;
  }
  .pagination {
    gap: 6px;
  }
  .btn-nav,
  .btn-page {
    padding: 6px 10px;
    font-size: 14px;
  }
  .btn-page {
    border-radius: 8px; /* küçük ekranda yuvarlak yerine kutu gibi */
  }
}
</style>
