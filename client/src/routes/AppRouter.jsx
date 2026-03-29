import {createBrowserRouter , RouterProvider} from "react-router-dom";
import AppLayout from "../components/layout/AppLayout"
import DashboardPage from "../pages/DashboardPage"
import MyDocsPage from "../pages/MyDocsPage"
import DocViewPage from "../pages/DocViewPage";

const router = createBrowserRouter([
    {
       element: <AppLayout />,
    children: [
      { path: '/',         element: <DashboardPage /> },
    //   { path: '/dashboard',element: <DashboardPage /> },
      { path: '/docs/my',  element: <MyDocsPage /> },
      {path : '/docs/:id' ,element : <DocViewPage/>}
    ]
    }
])

export default function AppRouter(){
    return <RouterProvider router={router} />
}