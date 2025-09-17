<template>
  <section class="profile">
    <h1>👤 Profil Yönetimi</h1>

    <!-- Profil Bilgileri -->
    <form class="card" @submit.prevent="saveProfile">
      <h2>👤 Ad Soyad</h2>
      <div class="form-group">
        <label>Ad</label>
        <input v-model="first_name" type="text" required />
      </div>
      <div class="form-group">
        <label>Soyad</label>
        <input v-model="last_name" type="text" required />
      </div>
      <div class="actions">
        <button class="btn-primary" :disabled="savingProfile">
          {{ savingProfile ? "Kaydediliyor..." : "Kaydet" }}
        </button>
      </div>
      <p v-if="profileMsg" class="msg success">{{ profileMsg }}</p>
      <p v-if="profileErr" class="msg error">{{ profileErr }}</p>
    </form>

    <!-- Şifre Değiştir -->
    <form class="card" @submit.prevent="savePassword">
      <h2>🔒 Şifre Değiştir</h2>
      <div class="form-group">
        <label>Mevcut Şifre</label>
        <input v-model="current_password" type="password" required />
      </div>
      <div class="form-group">
        <label>Yeni Şifre</label>
        <input v-model="new_password" type="password" required />
      </div>
      <div class="actions">
        <button class="btn-primary" :disabled="savingPass">
          {{ savingPass ? "Güncelleniyor..." : "Şifreyi Güncelle" }}
        </button>
      </div>
      <p v-if="passMsg" class="msg success">{{ passMsg }}</p>
      <p v-if="passErr" class="msg error">{{ passErr }}</p>
    </form>

    <!-- E-posta Değişikliği -->
    <form class="card" @submit.prevent="sendEmailChange">
      <h2>📧 E-posta Değiştir</h2>
      <div class="form-group">
        <label>Mevcut E-posta</label>
        <input :value="email" type="email" disabled />
      </div>
      <div class="form-group">
        <label>Yeni E-posta</label>
        <input v-model="new_email" type="email" required />
      </div>
      <div class="actions">
        <button class="btn-primary" :disabled="sendingEmail">
          {{ sendingEmail ? "Gönderiliyor..." : "Onay Maili Gönder" }}
        </button>
      </div>
      <p v-if="emailMsg" class="msg success">{{ emailMsg }}</p>
      <p v-if="emailErr" class="msg error">{{ emailErr }}</p>
    </form>
  </section>
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
  }
});

const saveProfile = async () => {
  profileMsg.value = "";
  profileErr.value = "";
  savingProfile.value = true;
  try {
    await updateMe({ first_name: first_name.value, last_name: last_name.value });
    profileMsg.value = "✅ Profil güncellendi.";
    if (auth.fetchMe) await auth.fetchMe();
  } catch (e) {
    profileErr.value = e?.response?.data?.message || "❌ Profil güncellenemedi.";
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
    passMsg.value = "✅ Şifre güncellendi.";
    current_password.value = "";
    new_password.value = "";
  } catch (e) {
    passErr.value = e?.response?.data?.message || "❌ Şifre güncellenemedi.";
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
    emailMsg.value = "✅ Onay maili gönderildi. Gelen kutunu kontrol et.";
    new_email.value = "";
  } catch (e) {
    emailErr.value = e?.response?.data?.message || "❌ Mail gönderilemedi.";
  } finally {
    sendingEmail.value = false;
  }
};
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; }

.profile {
  padding: 20px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
}

.profile h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #333;
}

/* Kart */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 32px;
  width: 100%;
  max-width: 900px; /* 🔹 daha geniş */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 15px;
  font-weight: 600;
  color: #444;
}

.form-group input {
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  background: #fff;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #4facfe;
  box-shadow: 0 0 6px rgba(79,172,254,0.4);
}

/* mesajlar */
.msg { margin-top: 8px; font-size: 0.95rem; }
.success { color: #2e7d32; }
.error { color: #c62828; }

/* buton */
.btn-primary {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border: none;
  padding: 14px 22px;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-primary:hover:not(:disabled) { filter: brightness(0.9); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* responsive */
@media (max-width: 768px) {
  .card { padding: 20px; }
  .btn-primary { width: 100%; }
}
</style>
