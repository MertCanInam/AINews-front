<template>
  <div class="ticket-card">
    <header>
      <h3>{{ ticket.title }}</h3>
      <span class="status" :class="ticket.status">{{ statusLabels[ticket.status] }}</span>
    </header>

    <p class="description">{{ ticket.description }}</p>

    <footer>
      <small>
        👤 {{ ticket.User?.first_name || "Bilinmiyor" }}
        {{ ticket.User?.last_name || "" }}
        <span v-if="ticket.User?.email">| 📧 {{ ticket.User.email }}</span>
        <br />
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
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  gap: 12px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.status.open {
  background: #e3f2fd;
  color: #1976d2;
}
.status.read {
  background: #fff3cd;
  color: #856404;
}
.status.closed {
  background: #f8d7da;
  color: #721c24;
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.actions button {
  margin-left: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  font-weight: 600;
  transition: 0.2s;
}
.actions button:hover {
  filter: brightness(0.9);
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .ticket-card {
    padding: 12px;
  }
  header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .status {
    font-size: 11px;
    padding: 3px 8px;
  }
  .actions button {
    padding: 5px 10px;
    font-size: 13px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .ticket-card {
    padding: 10px;
  }
  footer {
    flex-direction: column;
    align-items: flex-start;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .actions button {
    margin-left: 0;
    flex: 1; /* butonlar eşit genişlikte olsun */
    min-width: 80px;
    font-size: 12px;
    padding: 5px 8px;
  }
}
</style>
