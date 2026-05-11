import React, { useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAppTheme } from '../utils/ThemeContext';

function AnimatedCategoryTabs({ categories, selected, onSelect }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollRef = useRef(null);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat, index) => {
          const isSelected = selected === cat.type;

          return (
            <TouchableOpacity
              key={cat.type}
              activeOpacity={0.7}
              onPress={() => onSelect(cat.type)}
              style={[styles.tab, isSelected && styles.tabActive]}
            >
              <View style={[styles.imgContainer, isSelected && styles.imgActive]}>
                <Image source={cat.image} style={styles.image} />
              </View>
              <Text style={[styles.text, isSelected && styles.textActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.md,
    },
    tab: {
      alignItems: 'center',
      marginRight: theme.spacing.md,
      width: 70,
    },
    tabActive: {
      // optional subtle active styling
    },
    imgContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
      borderWidth: 2,
      borderColor: 'transparent',
      ...theme.shadows.light,
    },
    imgActive: {
      borderColor: theme.colors.accent,
      backgroundColor: '#ffe5d9',
    },
    image: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    text: {
      ...theme.typography.label,
      textAlign: 'center',
      fontSize: 11,
    },
    textActive: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });

export default React.memo(AnimatedCategoryTabs);
