import AuthMiddleware from 'src/router/middlewares/auth'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        meta: { middlewares: [AuthMiddleware] },
        component: () => import('pages/IndexPage.vue'),
      },
      { path: 'login', name: 'login', component: () => import('pages/Auth/LoginPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
