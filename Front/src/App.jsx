import { BrowserRouter, Routes, Route } from "react-router-dom";
import useRouter from "@/lib/hooks/useRouter";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function App() {
  const routes = useRouter() || [];

  // Fonction pour déterminer si une route doit être protégée et avec quel rôle
  const renderRouteElement = (path, Component) => {
    // Routes administrateur
    if (path.startsWith('/dash/admin')) {
      return (
        <ProtectedRoute requiredRole="admin">
          <Component />
        </ProtectedRoute>
      );
    }
    
    // Routes utilisateur authentifié (dashboard utilisateur, profil)
    if (path.startsWith('/dash/user') || path.startsWith('/profile')) {
      return (
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      );
    }
    
    // Routes publiques
    return <Component />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route 
            key={path} 
            path={path} 
            element={renderRouteElement(path, Component)} 
          />
        ))}
        <Route path="*" element={<h1>404: Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}