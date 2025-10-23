<template>
  <header class="navbar">
    <!-- Mobil için Hamburger Menü Butonu -->
    <button @click="$emit('toggle-sidebar')" class="hamburger-btn">
      <i class="fa-solid fa-bars"></i>
    </button>
    
    <!-- Kullanıcı bilgisi ve çıkış butonu olan sağ taraf -->
    <div class="right-side">
      <span v-if="user" class="user-info">
        {{ user?.first_name }} {{ user?.last_name }}
      </span>
      <button @click="logout" class="logout-btn">
        Çıkış
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// Bu event, bir üst bileşene (MainLayout.vue) sidebar'ı aç/kapa sinyali gönderir
defineEmits(['toggle-sidebar']);

const authStore = useAuthStore();
const router = useRouter();
const { user } = storeToRefs(authStore);

const logout = async () => {
  await authStore.logoutUser();
  router.push("/login");
};
</script>

<style scoped>
/* Ana Navbar Konteyneri */
.navbar {
  /* Konumlandırma ve Z-Index */
  position: sticky; /* Sayfa kaydırılsa bile üstte sabit kalır */
  top: 0;
  width: 100%;
  z-index: 20;

  /* Görünüm */
  background-color: white;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); /* Hafif gölge */
  padding: 1rem; /* 16px iç boşluk */
  
  /* Yerleşim */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Hamburger ve sağ tarafı ayırır */
}

/* Hamburger Menü Butonu */
.hamburger-btn {
  /* Görünüm */
  background: none;
  border: none;
  color: #374151; /* Koyu gri */
  font-size: 1.875rem; /* 30px */
  cursor: pointer;
  
  /* Responsive: Sadece küçük ekranlarda görünür */
  display: block;
}

/* Sağ Taraf (Kullanıcı Bilgisi ve Buton) */
.right-side {
  display: flex;
  align-items: center;
  gap: 1rem; /* 16px elemanlar arası boşluk */
}

/* Kullanıcı Adı Soyadı */
.user-info {
  color: #1f2937; /* Çok koyu gri */
  font-weight: 600; /* Yarı-kalın */
  
  /* Responsive: Çok küçük ekranlarda gizlenir */
  display: none;
}

/* Çıkış Butonu */
.logout-btn {
  /* Görünüm */
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  border: none;
  border-radius: 0.5rem; /* 8px köşe yuvarlaklığı */
  padding: 0.5rem 1rem; /* 8px dikey, 16px yatay boşluk */
  font-weight: 700; /* Kalın */
  cursor: pointer;
  
  /* Geçiş Efekti */
  transition: opacity 0.2s;
}

.logout-btn:hover {
  opacity: 0.9;
}

/* --- RESPONSIVE TASARIM --- */

/* Tablet ve üzeri (640px ve daha geniş ekranlar) */
@media (min-width: 640px) {
  .user-info {
    display: block; /* Kullanıcı adı görünür hale gelir */
  }
}

/* Masaüstü (1024px ve daha geniş ekranlar) */
@media (min-width: 1024px) {
  .hamburger-btn {
    display: none; /* Hamburger menü gizlenir */
  }

  .navbar {
    /* Navbar'ın justify-content'i, hamburger butonu kaybolduğu için 
       sağ tarafı otomatik olarak sağa itmek üzere ayarlanır. */
    justify-content: flex-end;
  }
}
</style>

