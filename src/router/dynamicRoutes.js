// 引入home
import Home from "../pages/Home"

let dynamicRoutes =[
    {
        path: "/",
        name: "home",
        component: Home,
          children:[]
      },
      {
        path:"*",
        component:() =>import(/* webpackChunkName: "page404" */ "../pages/Page404")
      }
]
export default dynamicRoutes;