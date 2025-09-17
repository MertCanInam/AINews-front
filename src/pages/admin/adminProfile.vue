<template>
  <section class="admin-profile">
    <h1>⚙️ Admin Profil Yönetimi</h1>

    <!-- 1) Profil Bilgileri -->
    <div class="card">
      <h2>👤 Profil Bilgileri</h2>
      <form @submit.prevent="saveProfile" class="form">
        <div class="form-group">
          <label>Ad</label>
          <input v-model="profile.first_name" type="text" />
        </div>
        <div class="form-group">
          <label>Soyad</label>
          <input v-model="profile.last_name" type="text" />
        </div>
        <div class="form-group">
          <label>E-posta</label>
          <input v-model="profile.email" type="email" />
        </div>
        <button class="btn">Kaydet</button>
      </form>
    </div>

    <!-- 2) Şifre Değiştir -->
    <div class="card">
      <h2>🔒 Şifre Değiştir</h2>
      <form @submit.prevent="changePwd" class="form">
        <div class="form-group">
          <label>Mevcut Şifre</label>
          <input v-model="passwordForm.oldPassword" type="password" />
        </div>
        <div class="form-group">
          <label>Yeni Şifre</label>
          <input v-model="passwordForm.newPassword" type="password" />
        </div>
        <button class="btn">Şifreyi Güncelle</button>
      </form>
    </div>

    <!-- 3) Yeni Admin Ekle -->
    <div class="card">
      <h2>➕ Yeni Admin Ekle</h2>
      <form @submit.prevent="createNewAdmin" class="form">
        <div class="form-group">
          <label>Ad</label>
          <input v-model="newAdmin.first_name" type="text" />
        </div>
        <div class="form-group">
          <label>Soyad</label>
          <input v-model="newAdmin.last_name" type="text" />
        </div>
        <div class="form-group">
          <label>E-posta</label>
          <input v-model="newAdmin.email" type="email" />
        </div>
        <div class="form-group">
          <label>Şifre</label>
          <input v-model="newAdmin.password" type="password" />
        </div>
        <button class="btn">Admin Oluştur</button>
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
.admin-profile {
  padding: 20px;
  margin-top: 40px;
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form {
  display: grid;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.form-group input {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.btn {
  background: #4facfe;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn:hover {
  background: #00c6ff;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .admin-profile {
    padding: 15px;
    gap: 20px;
  }
  .card {
    padding: 16px;
  }
  .card h2 {
    font-size: 16px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .admin-profile {
    padding: 10px;
    gap: 16px;
  }
  .card {
    padding: 14px;
  }
  .card h2 {
    font-size: 15px;
  }
  .form-group input {
    padding: 6px 8px;
    font-size: 14px;
  }
  .btn {
    padding: 8px 12px;
    font-size: 14px;
    width: 100%; /* butonlar tam genişlik */
  }
}
</style>
