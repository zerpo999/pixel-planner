import { useApp } from "@/context/AppContext";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";

export default function Index() {
  const { user } = useApp();
  return user ? <Dashboard /> : <AuthPage />;
}
