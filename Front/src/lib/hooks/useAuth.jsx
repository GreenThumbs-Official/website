import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer l'authentification et les autorisations
 * @returns {Object} Fonctions et états liés à l'authentification
 */
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  /**
   * Récupère le profil utilisateur depuis l'API
   * @returns {Promise<Object|null>} Les données utilisateur ou null en cas d'erreur
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return null;
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/user-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token invalide ou expiré
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          return null;
        }
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error while fetching user:', error);
      return null;
    }
  }, []);

  /**
   * Met à jour les informations utilisateur dans le state et le localStorage
   */
  const updateUserInfo = useCallback(async () => {
    const userData = await fetchUserProfile();
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      setIsAuthenticated(true);
      return userData;
    } else {
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
      return null;
    }
  }, [fetchUserProfile]);

  /**
   * Connecte l'utilisateur avec email et mot de passe
   * @param {Object} credentials - Les identifiants de connexion
   * @param {string} credentials.email - L'email de l'utilisateur
   * @param {string} credentials.password - Le mot de passe de l'utilisateur
   * @returns {Promise<Object>} Résultat de la connexion
   */
  const login = async (credentials) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        setUser(result.user);
        setIsAdmin(result.user.role === 'admin');
        setIsAuthenticated(true);
        
        return { success: true, data: result };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  /**
   * Déconnecte l'utilisateur
   */
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
    navigate('/auth/login');
  }, [navigate]);

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param {string} role - Le rôle à vérifier
   * @returns {boolean} True si l'utilisateur a le rôle spécifié
   */
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  /**
   * Vérifie si l'utilisateur est administrateur
   * @returns {boolean} True si l'utilisateur est admin
   */
  const checkIsAdmin = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  /**
   * Redirige vers le tableau de bord approprié en fonction du rôle
   */
  const redirectToDashboard = useCallback(() => {
    if (isAdmin) {
      navigate('/dash/admin');
    } else {
      navigate('/dash/user');
    }
  }, [isAdmin, navigate]);

  // Initialisation et synchronisation des données utilisateur
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Vérifier d'abord le localStorage
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Mettre à jour depuis l'API
      await updateUserInfo();
      setIsLoading(false);
    };
    
    initAuth();
    
    // Mettre à jour périodiquement
    const intervalId = setInterval(() => {
      updateUserInfo();
    }, 60000); // Toutes les minutes
    
    return () => clearInterval(intervalId);
  }, [updateUserInfo]);

  return {
    user,
    isAdmin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    checkIsAdmin,
    updateUserInfo,
    redirectToDashboard,
    fetchUserProfile
  };
}