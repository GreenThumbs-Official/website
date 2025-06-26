import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/lib/hooks/useAuth';

/**
 * Composant pour protéger les routes en fonction de l'authentification et des rôles
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les composants enfants à rendre si l'accès est autorisé
 * @param {string} [props.requiredRole] - Le rôle requis pour accéder à la route (optionnel)
 * @returns {React.ReactNode} Le composant enfant ou une redirection
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#6fbc29]">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dash/user" replace />;
  }

  return children;
}