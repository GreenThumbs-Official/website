import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Nav/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({
  userType = 'user', 
  title,
  description,
  data = [],
  columns = [],
  buttonText = 'Ajouter',
  onButtonClick,
  className,
  showButton = true,
  ...props
}) {
  const DashboardContent = () => (
    <div className={cn('space-y-4 md:space-y-6 p-4 md:p-0', className)} {...props}>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-white text-opacity-80 text-base md:text-lg">{description}</p>
        )}
      </div>

      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-white border-opacity-20 p-4 md:p-6">
        {showButton && (
          <div className="flex justify-between md:justify-end items-center mb-4">
            <h2 className="text-lg font-semibold text-white md:hidden">Données</h2>
            <button
              onClick={onButtonClick}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-all duration-200 border border-white border-opacity-30 text-sm md:text-base"
            >
              {buttonText}
            </button>
          </div>
        )}

        <div className="hidden md:block bg-white bg-opacity-20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white border-opacity-20">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="text-white font-semibold bg-white bg-opacity-10"
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10"
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="text-white">
                        {column.accessor ? row[column.accessor] : column.cell?.(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-white text-opacity-60 py-8"
                  >
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="bg-white bg-opacity-20 rounded-lg p-4 space-y-2"
              >
                {columns.map((column, colIndex) => (
                  <div key={colIndex} className="flex justify-between items-center">
                    <span className="text-white text-opacity-80 text-sm font-medium">
                      {column.header}:
                    </span>
                    <span className="text-white text-sm">
                      {column.accessor ? row[column.accessor] : column.cell?.(row)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
              <p className="text-white text-opacity-60">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Sidebar userType={userType}>
      <DashboardContent />
    </Sidebar>
  );
}

export function UnifiedDashboard({ isAdmin, ...props }) {
  const [userRole, setUserRole] = useState('user');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/auth/login');
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
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/auth/login');
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
  };

  const updateUserInfo = async () => {
    const userData = await fetchUserProfile();
    
    if (userData) {
      const currentUserStr = localStorage.getItem('user');
      let currentUser = null;
      
      try {
        currentUser = JSON.parse(currentUserStr);
      } catch (error) {
        console.error('Error:', error);
      }
      
      if (!currentUser || currentUser.role !== userData.role) {
        console.log('Updated user info');
        localStorage.setItem('user', JSON.stringify(userData));
        setUserRole(userData.role || 'user');
        
        if (isAdmin && userData.role !== 'admin') {
          navigate('/dash/user');
        }
        else if (!isAdmin && userData.role === 'admin') {
          const goToAdmin = window.confirm('Voulez-vous etre redirige sur le dashboard admin?');
          if (goToAdmin) {
            navigate('/dash/admin');
          }
        }
      }
      
      return userData.role;
    }
    
    return null;
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      navigate('/auth/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      setUserRole(user.role || 'user');
      
      if (isAdmin && user.role !== 'admin') {
        navigate('/dash/user');
      }
    } catch (error) {
      console.error('Error while retrieving user info:', error);
      setUserRole('user');
    } finally {
      setIsLoading(false);
    }
    
    updateUserInfo();
    
    const intervalId = setInterval(() => {
      updateUserInfo();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [isAdmin, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-[#6fbc29]">
      <div className="text-white text-xl">Chargement...</div>
    </div>;
  }

  if (isAdmin) {
    return <Dashboard userType="admin" {...props} />;
  }
  return <Dashboard userType="user" showButton={true} {...props} />;
}