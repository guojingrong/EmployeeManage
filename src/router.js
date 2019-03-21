import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router);

export default new Router({
    mode: "history",
    base: "/",
    routes: [{
            path: "/",
            name: "login",
            meta: {
                title: "登录"
            },
            component: () => import("@/views/Login.vue")
        },
        {
            path: "/home",
            name: "home",
            meta: {
                title: "员工管理系统"
            },
            component: () => import("@/views/Home.vue"),
            children: [
                {
                    path:"/",
                    name:"welcome",
                    component:()=>import("@/views/Welcome.vue")
                },
                {
                    path: "/emp",
                    name:"emp",
                    meta:{
                        title:"员工管理"
                    },
                    component:()=>import("@/views/emp/EmployeeManage.vue")
                },
                {
                    path: "/dept",
                    name:"dept",
                    meta:{
                        title:"部门管理"
                    },
                    component:()=>import("@/views/emp/DepartmentManage.vue")
                },
                {
                    path: "/menu",
                    name:"menu",
                    meta:{
                        title:"菜单管理"
                    },
                    component:()=>import("@/views/sys/MenuManage.vue")
                },
                {
                    path: "/user",
                    name:"user",
                    meta:{
                        title:"用户管理"
                    },
                    component:()=>import("@/views/sys/UserManage.vue")
                },
                {
                    path: "/age",
                    name:"age",
                    meta:{
                        title:"年龄段统计"
                    },
                    component:()=>import("@/views/total/Age.vue")
                }

            ]

        }
    ]
})