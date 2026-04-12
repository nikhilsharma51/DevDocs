import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import DashboardPage from "../pages/DashboardPage";
import MyDocsPage from "../pages/MyDocsPage";
import DocViewPage from "../pages/DocViewPage";
import DocEditorPage from "../pages/DocEditorPage";
import SearchPage from "../pages/SearchPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
  
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: <AppLayout />,
    children: [
      // { path: "/", element: <DashboardPage /> },
        { path: '/',element: <DashboardPage /> },
      { path: "/docs/my", element: <MyDocsPage /> },
      { path: '/docs/new',      element: <DocEditorPage /> },
      { path: "/docs/:id", element: <DocViewPage /> },
      { path: '/docs/:id/edit', element: <DocEditorPage /> },
      { path: '/search',        element: <SearchPage /> },

    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
