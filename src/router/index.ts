import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import {supermanager} from "../store/supermanager";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '表格',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            {
                path: '/charts',
                name: 'basecharts',
                meta: {
                    title: '图表',
                    permiss: '11',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            },
            {
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            },
            {
                path: '/tabs',
                name: 'tabs',
                meta: {
                    title: 'tab标签',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    title: '鼓励作者',
                    permiss: '14',
                },
                component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },

            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            },
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '导出Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
            //管理员管理
            {
                path:'/SchoolManager',
                name:'SchoolManager',
                meta:{
                    title: '学校管理员管理',
                },
                children:[
                    {
                        path:'/SchoolManagerList',
                        name:'SchoolManagerList',
                        meta:{
                            title: '学校管理员列表',
                        },
                        component:() => import('../views/manager/SchoolManagerManage/SchoolManagerList.vue')
                    },
                    {
                        path:'/SchoolManagerDetail',
                        name:'SchoolManagerDetail',
                        meta:{
                            title: '学校管理员详情',
                        },
                        component:() => import('../views/manager/SchoolManagerManage/SchoolManagerDetail.vue')
                    },
                    {
                        path:'/SchoolManagerCreate',
                        name:'SchoolManagerCreate',
                        meta:{
                            title: '学校管理员创建',
                        },
                        component:() => import('../views/manager/SchoolManagerManage/SchoolManagerCreate.vue')
                    },
                ]
            },
            //管理员学院管理
            {
                path:'/SchoolManage',
                name:'SchoolManage',
                meta:{
                    title: '学院管理',
                },
                children:[
                    {
                        path: '/SchoolList',
                        name: 'SchoolList',
                        meta: {
                            title: '学校列表'
                        },
                        component:() => import('../views/manager/SchoolManage/SchoolList.vue')
                    },
                    {
                        path: '/SchoolDetail',
                        name: 'SchoolDetail',
                        meta: {
                            title: '学院详情'
                        },
                        component:() => import('../views/manager/SchoolManage/SchoolDetail.vue')
                    },
                    {
                        path: '/SchoolCreate',
                        name: 'SchoolCreate',
                        meta: {
                            title: '创建学院'
                        },
                        component:() => import('../views/manager/SchoolManage/SchoolCreate.vue')
                    },
                ]
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const superManagerInfo = supermanager()
    const permiss = usePermissStore();
    //增加白名单
    const whiteList = ['/login']
    // if (superManagerInfo.token) {
    //     if (to.path === '/login') {
    //         next({path: '/login'})
    //     }
    // }
    // else {
    //     if (whiteList.indexOf(to.path) > -1) {
    //         next()
    //     }
    //     else {
    //         next('/login')
    //     }
    // }
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
