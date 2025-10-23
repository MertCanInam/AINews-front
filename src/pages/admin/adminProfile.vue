<template>
  <section class="admin-profile-page">
    <h1 class="page-title">🛡️ Admin Profil Yönetimi</h1>

    <div class="profile-grid">
      <!-- Profil Bilgileri -->
      <form class="card" @submit.prevent="saveProfile">
        <h2 class="card-title">👤 Profil Bilgileri</h2>
        <div class="form-group">
          <label for="admin-first-name">Ad</label>
          <input id="admin-first-name" v-model="profile.first_name" type="text" />
        </div>
        <div class="form-group">
          <label for="admin-last-name">Soyad</label>
          <input id="admin-last-name" v-model="profile.last_name" type="text" />
        </div>
        <div class="form-group">
          <label for="admin-email">E-posta</label>
          <input id="admin-email" v-model="profile.email" type="email" />
        </div>
        <div class="actions">
          <button class="submit-btn">Kaydet</button>
        </div>
      </form>

      <!-- Şifre Değiştir -->
      <form class="card" @submit.prevent="changePwd">
        <h2 class="card-title">🔒 Şifre Değiştir</h2>
        <div class="form-group">
          <label for="admin-old-pass">Mevcut Şifre</label>
          <input id="admin-old-pass" v-model="passwordForm.oldPassword" type="password" />
        </div>
        <div class="form-group">
          <label for="admin-new-pass">Yeni Şifre</label>
          <input id="admin-new-pass" v-model="passwordForm.newPassword" type="password" />
        </div>
        <div class="actions">
          <button class="submit-btn">Şifreyi Güncelle</button>
        </div>
      </form>

      <!-- Yeni Admin Ekle -->
      <form class="card full-width-card" @submit.prevent="createNewAdmin">
        <h2 class="card-title">➕ Yeni Admin Ekle</h2>
        <div class="new-admin-grid">
          <div class="form-group">
            <label for="new-admin-fname">Ad</label>
            <input id="new-admin-fname" v-model="newAdmin.first_name" type="text" />
          </div>
          <div class="form-group">
            <label for="new-admin-lname">Soyad</label>
            <input id="new-admin-lname" v-model="newAdmin.last_name" type="text" />
          </div>
          <div class="form-group">
            <label for="new-admin-email">E-posta</label>
            <input id="new-admin-email" v-model="newAdmin.email" type="email" />
          </div>
          <div class="form-group">
            <label for="new-admin-pass">Şifre</label>
            <input id="new-admin-pass" v-model="newAdmin.password" type="password" />
          </div>
        </div>
        <div class="actions">
          <button class="submit-btn">Admin Oluştur</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getProfile,
  updateProfile,
  changePassword,
  createAdmin,
} from "@/api/admin/adminProfileService";

const profile = ref({ first_name: "", last_name: "", email: "" });
const passwordForm = ref({ oldPassword: "", newPassword: "" });
const newAdmin = ref({ first_name: "", last_name: "", email: "", password: "" });

onMounted(async () => {
  try {
    profile.value = await getProfile();
  } catch (err) {
    console.error("Profil alınamadı:", err);
    // Hata mesajı gösterilebilir
  }
});

async function saveProfile() {
  try {
    await updateProfile(profile.value);
    alert("✅ Profil güncellendi");
  } catch (err) {
    alert("❌ Profil güncellenemedi");
  }
}

async function changePwd() {
  try {
    await changePassword(passwordForm.value);
    alert("✅ Şifre güncellendi");
    passwordForm.value = { oldPassword: "", newPassword: "" };
  } catch (err) {
    alert("❌ Şifre değiştirilemedi");
  }
}

async function createNewAdmin() {
  try {
    await createAdmin(newAdmin.value);
    alert("✅ Yeni admin eklendi");
    newAdmin.value = { first_name: "", last_name: "", email: "", password: "" };
  } catch (err) {
    alert("❌ Yeni admin eklenemedi");
  }
}
</script>

<style scoped>
.admin-profile-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

/* Grid Yapısı */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobil için tek sütun */
  gap: 1.5rem;
}

/* Form Kartları */
.card {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

/* Form Elemanları */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-group label {
  font-weight: 600;
  color: #374151;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}
.new-admin-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

/* Butonlar */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
.submit-btn {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}
.submit-btn:hover {
  opacity: 0.9;
}

/* Responsive */
@media (min-width: 768px) {
  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .full-width-card {
    grid-column: span 2;
  }
  .new-admin-grid {
      grid-template-columns: repeat(2, 1fr);
  }
}
</style>
