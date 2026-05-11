import React, { useMemo } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../utils/ThemeContext';

function FeaturedBanner({ image, title, subtitle, onPress }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.btn}>
            <Text style={styles.btnText}>Order Now</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(FeaturedBanner);

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      height: 180,
      ...theme.shadows.medium,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'flex-end',
      padding: theme.spacing.md,
    },
    content: {
      alignItems: 'flex-start',
    },
    title: {
      color: '#fff',
      fontSize: 22,
      fontWeight: '900',
      marginBottom: 4,
    },
    subtitle: {
      color: '#eee',
      fontSize: 14,
      marginBottom: theme.spacing.md,
    },
    btn: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.round,
    },
    btnText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
  });
