<template>
  <div class="profile-page-container">
    <h1 class="page-title">👤 Profil Yönetimi</h1>

    <div class="profile-grid">
      <!-- Sol Sütun: Profil Bilgileri -->
      <form class="profile-card left-column" @submit.prevent="saveProfile">
        <h2 class="card-title">Profil Bilgileri</h2>
        
        <div class="form-group">
          <label for="first_name">Ad</label>
          <input id="first_name" v-model="first_name" type="text" required />
        </div>
        
        <div class="form-group">
          <label for="last_name">Soyad</label>
          <input id="last_name" v-model="last_name" type="text" required />
        </div>

        <div class="actions">
          <button class="submit-btn" :disabled="savingProfile">
            {{ savingProfile ? "Kaydediliyor..." : "Bilgileri Kaydet" }}
          </button>
        </div>

        <p v-if="profileMsg" class="message success">{{ profileMsg }}</p>
        <p v-if="profileErr" class="message error">{{ profileErr }}</p>
      </form>

      <!-- Sağ Sütun: Şifre ve E-posta -->
      <div class="right-column">
        <!-- Şifre Değiştirme Formu -->
        <form class="profile-card" @submit.prevent="savePassword">
          <h2 class="card-title">🔒 Şifre Değiştir</h2>
          
          <div class="form-group">
            <label for="current_password">Mevcut Şifre</label>
            <input id="current_password" v-model="current_password" type="password" required />
          </div>
          
          <div class="form-group">
            <label for="new_password">Yeni Şifre</label>
            <input id="new_password" v-model="new_password" type="password" required />
          </div>

          <div class="actions">
            <button class="submit-btn" :disabled="savingPass">
              {{ savingPass ? "Güncelleniyor..." : "Şifreyi Güncelle" }}
            </button>
          </div>
          
          <p v-if="passMsg" class="message success">{{ passMsg }}</p>
          <p v-if="passErr" class="message error">{{ passErr }}</p>
        </form>

        <!-- E-posta Değiştirme Formu -->
        <form class="profile-card" @submit.prevent="sendEmailChange">
          <h2 class="card-title">📧 E-posta Değiştir</h2>
          
          <div class="form-group">
            <label>Mevcut E-posta</label>
            <input :value="email" type="email" disabled class="disabled-input" />
          </div>
          
          <div class="form-group">
            <label for="new_email">Yeni E-posta</label>
            <input id="new_email" v-model="new_email" type="email" required />
          </div>

          <div class="actions">
            <button class="submit-btn" :disabled="sendingEmail">
              {{ sendingEmail ? "Gönderiliyor..." : "Onay Maili Gönder" }}
            </button>
          </div>
          
          <p v-if="emailMsg" class="message success">{{ emailMsg }}</p>
          <p v-if="emailErr" class="message error">{{ emailErr }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { getMe, updateMe, changePassword, requestEmailChange } from "@/api/profileService";

const auth = useAuthStore();

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const new_email = ref("");
const current_password = ref("");
const new_password = ref("");
const savingProfile = ref(false);
const profileMsg = ref("");
const profileErr = ref("");
const savingPass = ref(false);
const passMsg = ref("");
const passErr = ref("");
const sendingEmail = ref(false);
const emailMsg = ref("");
const emailErr = ref("");

onMounted(async () => {
  try {
    const { data } = await getMe();
    const me = data?.data || {};
    first_name.value = me.first_name || "";
    last_name.value = me.last_name || "";
    email.value = me.email || "";
  } catch (e) {
    console.error(e);
    profileErr.value = "Profil bilgileri yüklenemedi.";
  }
});

const saveProfile = async () => {
  profileMsg.value = "";
  profileErr.value = "";
  savingProfile.value = true;
  try {
    await updateMe({ first_name: first_name.value, last_name: last_name.value });
    profileMsg.value = "✅ Profil başarıyla güncellendi.";
    if (auth.fetchMe) await auth.fetchMe();
  } catch (e) {
    profileErr.value = e?.response?.data?.message || "❌ Profil güncellenirken bir hata oluştu.";
  } finally {
    savingProfile.value = false;
  }
};

const savePassword = async () => {
  passMsg.value = "";
  passErr.value = "";
  savingPass.value = true;
  try {
    await changePassword(current_password.value, new_password.value);
    passMsg.value = "✅ Şifre başarıyla güncellendi.";
    current_password.value = "";
    new_password.value = "";
  } catch (e) {
    passErr.value = e?.response?.data?.message || "❌ Şifre güncellenemedi. Lütfen mevcut şifrenizi kontrol edin.";
  } finally {
    savingPass.value = false;
  }
};

const sendEmailChange = async () => {
  emailMsg.value = "";
  emailErr.value = "";
  sendingEmail.value = true;
  try {
    await requestEmailChange(new_email.value);
    emailMsg.value = "✅ Onay maili gönderildi. Lütfen gelen kutunuzu kontrol edin.";
    new_email.value = "";
  } catch (e) {
    emailErr.value = e?.response?.data?.message || "❌ E-posta değiştirme isteği gönderilemedi.";
  } finally {
    sendingEmail.value = false;
  }
};
</script>

<style scoped>
.profile-page-container {
  max-width: 1200px; /* Daha geniş bir konteyner */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 32px */
}

.page-title {
  font-size: 1.875rem; /* 30px */
  font-weight: 800;
  text-align: center;
  color: #111827;
}

/* Yeni Grid Yapısı */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobil: Varsayılan tek sütun */
  gap: 2rem; /* 32px */
}

/* Sağ Sütun İçin Konteyner */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Sağ sütundaki kartlar arası boşluk */
}

/* Form Kart Stilleri */
.profile-card {
  background-color: white;
  padding: 2rem; /* 32px */
  border-radius: 1rem; /* 16px */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
}

.card-title {
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  margin: 0;
}

/* Form Elemanları */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 8px */
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 95%; /* Genişliği biraz daralt */
  margin-left: auto; /* Yatayda ortala */
  margin-right: auto; /* Yatayda ortala */
  padding: 0.75rem 1rem; /* 12px 16px */
  border: 1px solid #d1d5db;
  border-radius: 0.5rem; /* 8px */
  font-size: 1rem; /* 16px */
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.disabled-input {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

/* Buton Alanı */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem; /* Butonları biraz aşağı alır */
}

.submit-btn {
  padding: 0.75rem 1.5rem; /* 12px 24px */
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
.message {
  margin: -0.5rem 0 0 0; /* Butondan sonraki boşluğu ayarlar */
  font-weight: 500;
  font-size: 0.9rem;
}
.success {
  color: #166534;
}
.error {
  color: #991b1b;
}

/* --- RESPONSIVE TASARIM --- */
/* Masaüstü (1024px ve üzeri) */
@media (min-width: 1024px) {
  .profile-grid {
    /* Sol sütun %60, sağ sütun %40 gibi bir oran */
    grid-template-columns: 3fr 2fr; 
  }
}
</style>

