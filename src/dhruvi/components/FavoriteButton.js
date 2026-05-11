import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../utils/ThemeContext';

function FavoriteButton({ isFavorite, onPress, style }) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
      <Icon 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={24} 
        color={isFavorite ? theme.colors.accent : theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );
}

export default React.memo(FavoriteButton);
