<template>
  <section class="tickets-page">
    <h1>Öneriler</h1>

    <form class="ticket-form" @submit.prevent="submitTicket">
      <label>
        Başlık
        <input
          v-model="title"
          type="text"
          required
          minlength="3"
          maxlength="255"
          placeholder="Kısa bir başlık"
        />
      </label>

      <label>
        Açıklama
        <textarea
          v-model="description"
          rows="6"
          required
          minlength="10"
          maxlength="5000"
          placeholder="Detayları yaz..."
        ></textarea>
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? "Gönderiliyor..." : "Gönder" }}
      </button>
    </form>

    <div v-if="success" class="alert success">{{ success }}</div>
    <div v-if="error" class="alert error">{{ error }}</div>

    <h2>Önerilerim</h2>
    <div class="ticket-list">
      <TicketCard v-for="t in myTickets" :key="t.id" :ticket="t" />
      <p v-if="!myTickets.length" class="empty">Henüz ticket yok.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createTicket, getMyTickets } from "@/api/ticketsService";
import TicketCard from "@/components/ticketCard.vue";

const title = ref("");
const description = ref("");
const loading = ref(false);
const success = ref(null);
const error = ref(null);
const myTickets = ref([]);

const loadTickets = async () => {
  try {
    const { data } = await getMyTickets();
    myTickets.value = Array.isArray(data) ? data : (data.items ?? []);
  } catch (e) {
    error.value = "Ticketlar yüklenemedi.";
  }
};

const submitTicket = async () => {
  if (title.value.trim().length < 3 || description.value.trim().length < 10) return;
  loading.value = true;
  error.value = null;
  success.value = null;
  try {
    await createTicket({
      title: title.value.trim(),
      description: description.value.trim(),
    });
    success.value = "Önerin alındı, teşekkürler!";
    title.value = "";
    description.value = "";
    await loadTickets();
  } catch (e) {
    error.value = e?.response?.data?.message || "Gönderim hatası.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadTickets);
</script>

<style scoped>
/* her şey kutu modeline dahil olsun → taşma olmasın */
*, *::before, *::after { box-sizing: border-box; }

.tickets-page {
  width: 100%;
  max-width: 800px;          /* masaüstünde genişlik sınırı */
  margin: 100px auto 24px;   /* navbar altı boşluk + alttan nefes */
  padding: 0 16px;           /* kenarlardan güvenli boşluk */
  display: grid;
  gap: 24px;
  overflow-x: hidden;        /* olası yatay kaymayı tamamen kapat */
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color, #333);
  text-align: center;
  margin: 0;
}

h2 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 8px 0 0;
  color: var(--text-color, #333);
}

/* Form kartı */
.ticket-form {
  display: grid;
  gap: 16px;
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  width: 100%;        /* parent’in dışına çıkma */
  max-width: 100%;
}

.ticket-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

/* Modern input/textarea */
.ticket-form input,
.ticket-form textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  font-size: 14px;
  background: #f9fafb;
  transition: all 0.2s ease;
  outline: none;
}

.ticket-form textarea {
  resize: vertical;       /* sadece dikeyde boyutlandır */
  min-height: 140px;
}

.ticket-form input:focus,
.ticket-form textarea:focus {
  border-color: #4facfe;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(79,172,254,0.2);
}

.ticket-form input::placeholder,
.ticket-form textarea::placeholder {
  color: #999;
  font-size: 13px;
}

/* Buton */
button {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}
button:hover:not(:disabled) { filter: brightness(0.92); }
button:disabled { opacity: 0.6; cursor: not-allowed; }

/* Alertler */
.alert {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}
.alert.success { background: #f0fff4; border: 1px solid #b7ebc6; color: #2f855a; }
.alert.error   { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; }

/* Ticket listesi */
.ticket-list { display: grid; gap: 16px; }
.empty { opacity: .7; text-align: center; font-style: italic; }

/* 📱 Responsive */
@media (max-width: 600px) {
  .tickets-page { padding: 0 12px; gap: 20px; }
  .ticket-form { padding: 16px; border-radius: 12px; }
  h1 { font-size: 1.6rem; }
  h2 { font-size: 1.25rem; }
}
</style>
