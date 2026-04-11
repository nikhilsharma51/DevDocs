import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import DashboardPage from "../pages/DashboardPage";
import MyDocsPage from "../pages/MyDocsPage";
import DocViewPage from "../pages/DocViewPage";
import DocEditorPage from "../pages/DocEditorPage";
import SearchPage from "../pages/SearchPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      //   { path: '/dashboard',element: <DashboardPage /> },
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
