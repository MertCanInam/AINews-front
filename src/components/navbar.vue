<template>
  <header class="navbar">
    <h1 class="logo">
      <img src="@/assets/logo3.png" alt="AI News Logo" class="logo-img" />
    </h1>

    <div class="right-side">
      <span v-if="user" class="user-info">
        {{ user?.first_name }} {{ user?.last_name }}
      </span>
      <button @click="logout" class="logout-btn">Çıkış</button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const router = useRouter();
const { user } = storeToRefs(authStore);

const logout = async () => {
  await authStore.logoutUser();
  router.push("/login");
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  display: flex;
  align-items: center;
  justify-content: space-between; /* 🔹 Masaüstünde logo solda, sağda buton */
  padding: 0 16px;
  z-index: 1000;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  gap: 8px;
}

.logo-img {
  height: 100px; /* Masaüstü */
  width: auto;
}

.right-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  font-weight: 500;
  color: #fff;
  font-size: 15px;
}

.logout-btn {
  background-color: white;
  color: #4facfe;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: grey;
  color: white;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .logo-img {
    height: 80px;
  }

  .navbar {
    height: 60px;
    padding: 0 12px;
  }

  .user-info {
    font-size: 14px;
  }

  .logout-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .navbar {
    justify-content: center; /* tüm navbar ortalanır */
    height: 55px;
    padding: 0 10px;
    position: relative;
  }

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%); /* 🔹 Logo tam ortaya gelir */
    margin: 0;
  }

  .logo-img {
    height: 50px; /* Mobil için küçültülmüş logo */
  }

  .right-side {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%); /* sağ üst köşeye */
  }

  .user-info {
    display: none; /* Mobilde kullanıcı adı gizli */
  }

  .logout-btn {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 8px;
  }
}
</style>
