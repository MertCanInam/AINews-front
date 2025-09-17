import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/login.vue";
import Register from "@/pages/register.vue";
import Dashboard from "@/pages/dashboard.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/store/auth";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        redirect: () => {
          const authStore = useAuthStore();
          if (authStore.user?.role_id === 1) {
            return "/admin/dashboard"; // admin → admin dashboard
          }
          return "/dashboard"; // normal user → user dashboard
        },
      },

      // Dashboard
      { path: "dashboard", component: Dashboard, meta: { requiresAuth: true } },

      // Posts
      {
        path: "posts",
        component: () => import("@/pages/Posts.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "posts/:id",
        component: () => import("@/pages/PostDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "saved-posts",
        component: () => import("@/pages/savedPosts.vue"),
        meta: { requiresAuth: true },
      },

      // Tickets
      {
        path: "tickets",
        component: () => import("@/pages/tickets.vue"),
        meta: { requiresAuth: true },
      },

      // Profile
      {
        path: "profile",
        component: () => import("@/pages/profile.vue"),
        meta: { requiresAuth: true },
      },

      // Confirm Email
      {
        path: "confirm-email",
        component: () => import("@/pages/ConfirmEmail.vue"),
      },

      // Admin Dashboard
      {
        path: "admin/dashboard",
        component: () => import("@/pages/admin/AdminDashboard.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },

      // ✅ Admin Routes
      {
        path: "admin/users",
        component: () => import("@/pages/admin/AdminUsers.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/sources",
        component: () => import("@/pages/admin/AdminSources.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/posts", // ✅ yeni eklenen route
        component: () => import("@/pages/admin/AdminPosts.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // router/index.js
      {
        path: "admin/tickets",
        component: () => import("@/pages/admin/AdminTickets.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/reports",
        component: () => import("@/pages/admin/AdminReports.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/saved-posts",
        component: () => import("@/pages/admin/AdminSavedPosts.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/profile", // ✅ yeni route
        component: () => import("@/pages/admin/AdminProfile.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // ✅ token varsa global header set et
  if (authStore.token) {
    import("@/api/http").then(({ setAuthHeader }) =>
      setAuthHeader(authStore.token)
    );
  }

  // Giriş kontrolü
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      return "/login";
    }
    if (!authStore.user) {
      try {
        await authStore.fetchMe();
      } catch {
        authStore.logoutUser();
        return "/login";
      }
    }
  }

  // ✅ Admin kontrolü
  if (to.meta.requiresAdmin && authStore.user?.role_id !== 1) {
    return "/dashboard"; // admin değilse ana sayfaya at
  }
});

export default router;
