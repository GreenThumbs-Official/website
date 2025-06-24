import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useRouter from "@/lib/hooks/useRouter";

function AuthSync() {
  const location = useLocation();
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    fetch("http://127.0.0.1:8000/api/user-profile", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const profile = await res.json();
          localStorage.setItem("user", JSON.stringify(profile));
        } else {
          // Unregister user: remove token and profile
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        // On error, also unregister user
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      });
  }, [location.pathname]);
  return null;
}

export default function App() {
  const routes = useRouter();

  return (
    <BrowserRouter>
      <AuthSync />
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<h1>404: Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}