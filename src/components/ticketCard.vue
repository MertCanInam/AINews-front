<template>
  <article class="ticket-card">
    <div class="header">
      <h3 class="title">{{ ticket.title }}</h3>
      <span class="badge" :class="ticket.status">{{ ticket.status }}</span>
    </div>

    <p class="desc">
      {{ ticket.description }}
    </p>

    <p class="meta">
      Oluşturma: {{ formattedCreated }}
      <span v-if="ticket.updated_at"> • Güncelleme: {{ formattedUpdated }}</span>
    </p>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  ticket: { type: Object, required: true },
});

const formattedCreated = computed(() =>
  props.ticket.created_at ? new Date(props.ticket.created_at).toLocaleString("tr-TR") : "-"
);
const formattedUpdated = computed(() =>
  props.ticket.updated_at ? new Date(props.ticket.updated_at).toLocaleString("tr-TR") : "-"
);
</script>

<style scoped>
.ticket-card {
  display: grid;
  gap: 8px;
  padding: 12px 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 2px 6px var(--shadow);
  transition: transform .2s, box-shadow .2s, border-color .2s;
}
.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(79,172,254,.2);
  border-color:#4facfe;
}

.header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.title {
  margin:0;
  font-size:1rem;
  font-weight:700;
  color:var(--text);
}

.badge {
  padding:4px 8px;
  border-radius:999px;
  font-size:.75rem;
  text-transform:capitalize;
  border:1px solid #e5e7eb;
}
.badge.open  { background:#e6f4ff; border-color:#b3d8ff; }  
.badge.read  { background:#fff7e6; border-color:#ffe58f; }  
.badge.closed{ background:#f6ffed; border-color:#b7eb8f; } 

.desc {
  margin:0;
  color:var(--muted);
  line-height:1.4;
  white-space:pre-wrap;
}
.meta {
  margin:0;
  font-size:.85rem;
  color:var(--muted);
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .ticket-card {
    padding: 10px 12px;
    font-size: 0.95rem;
  }
  .title {
    font-size: 0.95rem;
  }
  .badge {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .ticket-card {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
  .title {
    font-size: 0.9rem;
  }
  .desc {
    font-size: 0.85rem;
  }
  .meta {
    font-size: 0.8rem;
  }
}
</style>
