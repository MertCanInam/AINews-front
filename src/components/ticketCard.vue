<template>
  <article class="ticket-card">
    <div class="header">
      <h3 class="title">{{ ticket.title }}</h3>
      <span class="badge" :class="`status-${ticket.status}`">{{ statusLabels[ticket.status] }}</span>
    </div>
    <p class="description">{{ ticket.description }}</p>
    <p class="meta">
      Oluşturma: {{ formattedCreated }}
      <span v-if="ticket.updated_at && ticket.updated_at !== ticket.created_at"> • Güncelleme: {{ formattedUpdated }}</span>
    </p>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  ticket: { type: Object, required: true },
});

// Durum etiketlerini daha kullanıcı dostu hale getirelim
const statusLabels = {
  open: "Açık",
  read: "Okundu",
  closed: "Kapalı",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formattedCreated = computed(() => formatDate(props.ticket.created_at));
const formattedUpdated = computed(() => formatDate(props.ticket.updated_at));
</script>

<style scoped>
/* Ana Kart Konteyneri */
.ticket-card {
  background-color: white;
  padding: 1rem 1.25rem; /* 16px dikey, 20px yatay */
  border-radius: 0.75rem; /* 12px */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 8px elemanlar arası boşluk */
}

/* Kart Başlığı Alanı */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem; /* 16px */
}

/* Başlık Metni */
.title {
  margin: 0;
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: #1f2937;
}

/* Durum Rozeti (Badge) */
.badge {
  padding: 0.25rem 0.6rem; /* 4px dikey, 10px yatay */
  border-radius: 9999px; /* Tam yuvarlak */
  font-size: 0.75rem; /* 12px */
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0; /* Küçülmesin */
}
.status-open {
  background-color: #e0f2fe; /* Açık mavi */
  color: #0284c7;
}
.status-read {
  background-color: #fef3c7; /* Açık sarı */
  color: #d97706;
}
.status-closed {
  background-color: #dcfce7; /* Açık yeşil */
  color: #16a34a;
}

/* Açıklama Metni */
.description {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

/* Meta Bilgisi (Tarihler) */
.meta {
  margin: 0;
  font-size: 0.8rem; /* 13px */
  color: #6b7280;
  margin-top: 0.5rem; /* Üstten 8px boşluk */
}
</style>
