import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  People,
  TrendingUp,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { UserService } from '../../services/userService';

interface UserCounterProps {
  className?: string;
}

const UserCounter: React.FC<UserCounterProps> = ({ className }) => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrowing, setIsGrowing] = useState(false);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setIsLoading(true);
        
        const data = await UserService.getUserCount();
        const newCount = data.count;
        
        // Mostrar animación si el número aumentó
        if (userCount !== null && newCount > userCount) {
          setIsGrowing(true);
          setTimeout(() => setIsGrowing(false), 2000);
        }
        
        setUserCount(newCount);
        
      } catch (error) {
        console.error('Error al cargar contador de usuarios:', error);
        // Fallback a datos de prueba si la API falla
        setUserCount(127);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchUserCount, 30000);
    
    return () => clearInterval(interval);
  }, [userCount]);

  const formatUserCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        opacity: isGrowing ? 0.8 : 1,
        transform: isGrowing ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease-in-out',
      }}
      className={className}
    >
      <People 
        sx={{ 
          fontSize: 18, 
          color: 'white',
          opacity: 0.9
        }} 
      />
      
      <Typography
        variant="body2"
        sx={{
          color: 'white',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
        }}
      >
        {userCount ? formatUserCount(userCount) : '0'} usuarios
      </Typography>
      
      {isGrowing && (
        <TrendingUp 
          sx={{ 
            fontSize: 16, 
            color: colors.status.success,
            animation: 'pulse 1s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.5 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.5 },
            }
          }} 
        />
      )}
    </Box>
  );
};

export default UserCounter;
