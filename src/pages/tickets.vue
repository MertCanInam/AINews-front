<template>
  <div class="tickets-page-container">
    <h1 class="page-title">Öneri ve Görüşleriniz</h1>

    <!-- Yeni Öneri Oluşturma Formu -->
    <form class="ticket-form" @submit.prevent="submitTicket">
      <h2 class="form-title">Yeni Öneri Oluştur</h2>
      
      <div class="form-group">
        <label for="ticket-title">Başlık</label>
        <input
          id="ticket-title"
          v-model="title"
          type="text"
          required
          minlength="3"
          placeholder="Kısa bir başlık girin"
        />
      </div>

      <div class="form-group">
        <label for="ticket-description">Açıklama</label>
        <textarea
          id="ticket-description"
          v-model="description"
          rows="5"
          required
          minlength="10"
          placeholder="Önerinizi detaylandırın..."
        ></textarea>
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? "Gönderiliyor..." : "Gönder" }}
      </button>
    </form>
    
    <!-- Başarı ve Hata Mesajları -->
    <div v-if="success" class="alert success-alert">{{ success }}</div>
    <div v-if="error" class="alert error-alert">{{ error }}</div>

    <!-- Geçmiş Öneriler Listesi -->
    <div class="tickets-list-section">
      <h2 class="list-title">Geçmiş Önerilerim</h2>
      <div v-if="myTickets.length > 0" class="tickets-grid">
        <TicketCard v-for="t in myTickets" :key="t.id" :ticket="t" />
      </div>
      <p v-else class="empty-message">Henüz gönderilmiş bir öneriniz bulunmuyor.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createTicket, getMyTickets } from "@/api/ticketsService";
import TicketCard from "@/components/TicketCard.vue";

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
    error.value = "Geçmiş öneriler yüklenirken bir hata oluştu.";
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
    success.value = "Öneriniz başarıyla alındı, teşekkürler!";
    title.value = "";
    description.value = "";
    await loadTickets();
  } catch (e) {
    error.value = e?.response?.data?.message || "Öneri gönderilirken bir hata oluştu.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadTickets);
</script>

<style scoped>
.tickets-page-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 32px ana elemanlar arası boşluk */
}

.page-title {
  font-size: 1.875rem; /* 30px */
  font-weight: 800;
  text-align: center;
  color: #111827;
}

/* Form Stilleri */
.ticket-form {
  background-color: white;
  padding: 2rem; /* 32px */
  border-radius: 1rem; /* 16px */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
}
.form-title {
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  margin: 0;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 8px */
}
.form-group label {
  font-weight: 600;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem; /* 12px 16px */
  border: 1px solid #d1d5db;
  border-radius: 0.5rem; /* 8px */
  font-size: 1rem; /* 16px */
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Gönder Butonu */
.submit-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.3s;
}
.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Uyarı Mesajları */
.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}
.success-alert {
  background-color: #dcfce7;
  color: #166534;
}
.error-alert {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Ticket Listesi Alanı */
.tickets-list-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.list-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}
.tickets-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.empty-message {
  color: #6b7280;
  text-align: center;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}
</style>
