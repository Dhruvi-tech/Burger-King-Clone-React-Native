/**
 * responsive.js provides helpers to scale UI values across screen sizes.
 * Use scale, verticalScale, and moderateScale for responsive spacing and sizing.
 */
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scale a horizontal size value based on the current screen width.
export const scale = (size) => (width / guidelineBaseWidth) * size;

// Scale a vertical size value based on the current screen height.
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// Apply a moderated scaling factor to prevent overly large adjustments.
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const isIOS = Platform.OS === 'ios';
export const screenWidth = width;
export const screenHeight = height;