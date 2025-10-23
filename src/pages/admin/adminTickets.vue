<template>
  <section class="admin-tickets-page">
    <h1 class="page-title">🎟️ Ticket Yönetimi</h1>

    <div v-if="tickets.length > 0" class="tickets-grid">
      <AdminTicketCard
        v-for="t in tickets"
        :key="t.id"
        :ticket="t"
        @update-status="handleUpdateStatus"
      />
    </div>
    <p v-else class="empty-message">Gösterilecek ticket bulunamadı.</p>

    <!-- Sayfalama (Pagination) -->
    <div class="pagination" v-if="pagination.totalPages > 1">
      <button class="btn-nav" :disabled="pagination.currentPage === 1" @click="changePage(pagination.currentPage - 1)">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        class="btn-page"
        :class="{ active: page === pagination.currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <span v-if="pagination.totalPages > maxVisiblePages && !visiblePages.includes(pagination.totalPages)" class="dots">...</span>
      <button
        v-if="pagination.totalPages > maxVisiblePages && !visiblePages.includes(pagination.totalPages)"
        class="btn-page"
        :class="{ active: pagination.totalPages === pagination.currentPage }"
        @click="changePage(pagination.totalPages)"
      >
        {{ pagination.totalPages }}
      </button>
      <button class="btn-nav" :disabled="pagination.currentPage === pagination.totalPages" @click="changePage(pagination.currentPage + 1)">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllTickets, updateTicketStatus } from "@/api/admin/adminTicketService";
import AdminTicketCard from "@/components/admin/AdminTicketCard.vue";

const tickets = ref([]);
const pagination = ref({ total: 0, currentPage: 1, totalPages: 1 });
const maxVisiblePages = 5;

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
  const range = [];

  if (total <= maxVisiblePages) {
    for (let i = 1; i <= total; i++) range.push(i);
    return range;
  }

  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  if (current <= 3) {
    end = maxVisiblePages;
  } else if (current > total - 3) {
    start = total - maxVisiblePages + 1;
  }
  
  for (let i = start; i <= end; i++) range.push(i);
  return range;
});

async function handleUpdateStatus(id, status) {
  try {
    await updateTicketStatus(id, status);
    await fetchTickets(pagination.value.currentPage);
  } catch (err) {
    console.error("Ticket durumu güncellenemedi:", err);
  }
}

onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
.admin-tickets-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}
.tickets-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* 24px */
}
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.btn-nav, .btn-page {
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 0.375rem;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-nav:hover:not(:disabled), .btn-page:hover {
  background-color: #f9fafb;
}
.btn-page.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
.dots {
  color: #6b7280;
}
</style>
