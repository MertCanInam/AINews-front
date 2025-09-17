<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="title">Giriş Yap</h1>

      <form @submit.prevent="onSubmit" class="auth-form">
        <input
          v-model.trim="email"
          type="email"
          placeholder="E-posta"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Şifre"
          required
        />

        <button :disabled="loading" class="btn">
          {{ loading ? "Giriş yapılıyor..." : "Giriş Yap" }}
        </button>

        <p class="error" v-if="error">{{ error }}</p>

        <p class="muted">
          Hesabın yok mu?
          <router-link to="/register">Kayıt ol</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const router = useRouter();
const auth = useAuthStore();

const onSubmit = async () => {
  error.value = "";
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push("/dashboard");
  } catch (e) {
    error.value =
      e?.response?.data?.error ||
      "❌ Giriş başarısız. Bilgileri kontrol et.";
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
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 380px;
  text-align: center;
  animation: fadeIn 0.45s ease;
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
  transition: all 0.25s ease;
}
.btn:hover:not([disabled]) {
  opacity: 0.9;
  transform: translateY(-2px) scale(1.02);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Hata mesajı */
.error {
  color: #e84141;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 600;
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
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }
  input, .btn {
    font-size: 14px;
    padding: 10px 12px;
  }
}
</style>
