<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="title">Kayıt Ol</h1>

      <form @submit.prevent="onSubmit" class="auth-form">
        <input v-model.trim="first_name" placeholder="Ad" required />
        <input v-model.trim="last_name" placeholder="Soyad" required />
        <input v-model.trim="email" type="email" placeholder="E-posta" required />
        <input v-model="password" type="password" placeholder="Şifre" required />

        <button :disabled="loading" class="btn">
          {{ loading ? "Kaydediliyor..." : "Kayıt Ol" }}
        </button>

        <p class="error" v-if="error">{{ error }}</p>

        <p class="muted">
          Zaten hesabın var mı?
          <router-link to="/login">Giriş yap</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register as registerApi } from "@/api/authService";

const first_name = ref("");
const last_name = ref("");
const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");
const router = useRouter();

const onSubmit = async () => {
  error.value = "";
  loading.value = true;
  try {
    const { data } = await registerApi(
      first_name.value,
      last_name.value,
      email.value,
      password.value
    );

    if (data?.success || data?.user) {
      router.push({ path: "/login", query: { registered: "1" } });
    } else {
      error.value = data?.message || "Kayıt başarısız.";
    }
  } catch (e) {
    error.value =
      e?.response?.data?.error || "Kayıt olurken bir hata oluştu.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Arkaplan */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  padding: 16px;
}

/* Kart */
.auth-card {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: fadeIn 0.4s ease-in-out;
}

/* Başlık */
.title {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

/* Form */
.auth-form {
  display: grid;
  gap: 14px;
}

/* Inputlar */
input {
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
}

/* Buton */
.btn {
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  color: white;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover:not([disabled]) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Hata mesajı */
.error {
  color: #c00;
  font-size: 14px;
  margin-top: 8px;
}

/* Alt yazı */
.muted {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.muted a {
  color: #4facfe;
  font-weight: 600;
  text-decoration: none;
}

.muted a:hover {
  text-decoration: underline;
}

/* Animasyon */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
