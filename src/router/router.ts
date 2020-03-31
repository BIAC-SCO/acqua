import Vue from "vue";
import Router, { Route, RouteConfig } from "vue-router";
import { UserModule } from "@/store/modules/user";
import { PermissionModule } from "@/store/modules/permissions";
import Layout from "@/layout/index.vue";
import NProgress from "nprogress";
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false })

Vue.use(Router);
const whiteList = ["/login", "/auth-redirect"];

export const constantRoutes: RouteConfig[] = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
        name: "Home",
        meta: {
          title: "home",
          icon: "mdi-home",
          affix: true
        }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
    meta: { hidden: true }
  }
];

export const asyncRoutes: RouteConfig[] = [
  {
    path: "/achatvente",
    component: Layout,
    redirect: "achatvente/index",
    meta: { roles: ["admin", "ACQUAACHATVENTE"] },
    children: [
      {
        path: "index",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "@/views/AchatVente/index.vue"
          ),
        name: "Achat Vente",
        meta: {
          title: "Achat Vente",
          icon: "mdi-currency-eur",
          affix: true
        }
      }
    ]
  }
];

const createRouter = () =>
  new Router({
    mode: "history",
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
    base: process.env.BASE_URL,
    routes: constantRoutes
  });

const router = createRouter();

router.beforeEach(async (to: Route, from: Route, next: any) => {
  NProgress.start();
  if (UserModule.token) {
    if (
      !UserModule.utilisateur ||
      (PermissionModule.routes && PermissionModule.routes.length === 0)
    ) {
      UserModule.LoadUser()
        .then(() => {
          PermissionModule.GenerateRoutes(
            UserModule.utilisateur.Permissions.map(p => p.Id)
          );
          //Dynamically add accessible routes
          router.addRoutes(PermissionModule.dynamicRoutes);
          if (to.path.toUpperCase() == "/LOGIN") {
            next({ path: "/" });
          } else {
            next({ ...to, replace: true });
          }
        })
        .catch(reason => {
          next({ path: "/login" });
        });
    } else {
      next();
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next();
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login`);
    }
  }
});

router.afterEach((to: Route) => {
  // set page title
  NProgress.done();
  document.title = to.meta.title;
});
export default router;