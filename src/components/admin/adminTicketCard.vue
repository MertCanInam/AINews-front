<template>
  <div class="ticket-card" :class="`status-border-${ticket.status}`">
    <header class="card-header">
      <div class="header-info">
        <h3>{{ ticket.title }}</h3>
        <span class="status-badge" :class="`status-badge-${ticket.status}`">
          {{ statusLabels[ticket.status] }}
        </span>
      </div>
      <p class="user-info">
        👤 {{ ticket.User?.first_name || "Bilinmiyor" }} {{ ticket.User?.last_name || "" }}
      </p>
    </header>

    <p class="description">{{ ticket.description }}</p>

    <footer class="card-footer">
      <small class="date-info">
        🗓️ {{ formatDate(ticket.created_at) }}
      </small>
      <div class="actions">
        <button v-if="ticket.status !== 'open'" @click="$emit('update-status', ticket.id, 'open')">Aç</button>
        <button v-if="ticket.status !== 'read'" @click="$emit('update-status', ticket.id, 'read')">Okundu</button>
        <button v-if="ticket.status !== 'closed'" @click="$emit('update-status', ticket.id, 'closed')">Kapat</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

defineEmits(['update-status']);

const statusLabels = {
  open: "Açık",
  read: "Okundu",
  closed: "Kapalı",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style scoped>
.ticket-card {
  background: #fff;
  padding: 1.25rem; /* 20px */
  border-radius: 0.75rem; /* 12px */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
  border-left-width: 4px;
}
/* Duruma göre sol kenarlık renkleri */
.status-border-open { border-left-color: #3b82f6; }
.status-border-read { border-left-color: #f59e0b; }
.status-border-closed { border-left-color: #22c55e; }

.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.header-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.header-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}
.user-info {
    margin: 0;
    font-size: 0.8rem;
    color: #6b7280;
}

/* Durum Rozeti */
.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}
.status-badge-open { background-color: #e0f2fe; color: #0284c7; }
.status-badge-read { background-color: #fef3c7; color: #d97706; }
.status-badge-closed { background-color: #dcfce7; color: #16a34a; }

.description {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}
.date-info {
  font-size: 0.8rem;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
.actions button {
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.actions button:hover {
  background-color: #f3f4f6;
}
</style>
