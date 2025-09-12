import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { colors } from '../theme';

interface ReputationIconsProps {
  positiveVotes: number;
  negativeVotes: number;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  showOnlyNegative?: boolean; // Nueva prop para mostrar solo el corazón negro
}

const ReputationIcons: React.FC<ReputationIconsProps> = ({ 
  positiveVotes, 
  negativeVotes, 
  size = 'medium',
  showLabels = false,
  showOnlyNegative = false
}) => {
  // Tamaños de iconos
  const iconSizes = {
    small: { icon: 20, text: '0.75rem' },
    medium: { icon: 24, text: '0.875rem' },
    large: { icon: 32, text: '1rem' }
  };

  const currentSize = iconSizes[size];
  
  // Lógica de tamaño del corazón negro
  const heartSize = negativeVotes >= positiveVotes 
    ? currentSize.icon 
    : currentSize.icon * 0.5;

  // Componente del ícono de regalito
  const GiftIcon = ({ size: iconSize }: { size: number }) => {
    const giftSize = iconSize * 1.3; // 30% más grande
    return (
      <Box
        sx={{
          width: giftSize,
          height: giftSize,
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {/* Cuerpo del regalo (amarillo) - perfectamente cuadrado */}
        <Box
          sx={{
            width: giftSize * 0.7,
            height: giftSize * 0.7,
            backgroundColor: '#FFD700', // Amarillo dorado
            position: 'absolute',
            top: giftSize * 0.15,
            left: giftSize * 0.15,
            borderRadius: '0px',
            border: '1px solid #FFA500',
          }}
        />
      
        {/* Cinta horizontal (roja) */}
        <Box
          sx={{
            width: giftSize * 0.7,
            height: giftSize * 0.12,
            backgroundColor: '#DC143C', // Rojo
            position: 'absolute',
            top: giftSize * 0.44,
            left: giftSize * 0.15,
            borderRadius: '0px',
          }}
        />
        
        {/* Cinta vertical (roja) - movida hacia el costado */}
        <Box
          sx={{
            width: giftSize * 0.12,
            height: giftSize * 0.7,
            backgroundColor: '#DC143C', // Rojo
            position: 'absolute',
            top: giftSize * 0.15,
            left: giftSize * 0.38,
            borderRadius: '0px',
          }}
        />
        
        {/* Moño superior - dos círculos grandes y juntos */}
        <Box
          sx={{
            width: giftSize * 0.18,
            height: giftSize * 0.18,
            backgroundColor: '#DC143C', // Rojo
            position: 'absolute',
            top: giftSize * 0.02,
            left: giftSize * 0.32,
            borderRadius: '50%',
            border: '1px solid #B22222',
          }}
        />
        <Box
          sx={{
            width: giftSize * 0.18,
            height: giftSize * 0.18,
            backgroundColor: '#DC143C', // Rojo
            position: 'absolute',
            top: giftSize * 0.02,
            left: giftSize * 0.5,
            borderRadius: '50%',
            border: '1px solid #B22222',
          }}
        />
      </Box>
    );
  };

  // Componente del ícono de corazón rojo quebrado (emoji)
  const HeartIcon = ({ size: iconSize }: { size: number }) => (
    <Box
      sx={{
        width: iconSize,
        height: iconSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${iconSize}px`,
        lineHeight: 1,
      }}
    >
      💔
    </Box>
  );

  // Si showOnlyNegative es true, solo mostrar el corazón rojo quebrado
  if (showOnlyNegative) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={`${negativeVotes} promesas fallidas`} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HeartIcon size={currentSize.icon} />
            <Typography
              variant="body2"
              sx={{
                fontSize: currentSize.text,
                fontWeight: 600,
                color: colors.text.primary,
                minWidth: 'fit-content'
              }}
            >
              {negativeVotes}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Ícono de regalito con contador */}
      <Tooltip title={`${positiveVotes} promesas cumplidas`} arrow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <GiftIcon size={currentSize.icon} />
          <Typography
            variant="body2"
            sx={{
              fontSize: currentSize.text,
              fontWeight: 600,
              color: colors.text.primary,
              minWidth: 'fit-content'
            }}
          >
            {positiveVotes}
          </Typography>
        </Box>
      </Tooltip>

      {/* Ícono de corazón rojo quebrado con contador (solo si hay votos negativos) */}
      {negativeVotes > 0 && (
        <Tooltip title={`${negativeVotes} promesas fallidas`} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HeartIcon size={heartSize} />
            <Typography
              variant="body2"
              sx={{
                fontSize: currentSize.text,
                fontWeight: 600,
                color: colors.text.primary,
                minWidth: 'fit-content'
              }}
            >
              {negativeVotes}
            </Typography>
          </Box>
        </Tooltip>
      )}

      {/* Labels opcionales */}
      {showLabels && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 1 }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Cumplidas: {positiveVotes}
          </Typography>
          {negativeVotes > 0 && (
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Fallidas: {negativeVotes}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReputationIcons;

