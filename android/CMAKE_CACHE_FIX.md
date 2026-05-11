# React Native Reanimated CMake Cache Issue - Fix Guide

## Issues Fixed

### 1. Corrupted CMake Cache (Ninja Build Manifest Loop)
The `.cxx` directory in react-native-reanimated can become corrupted, causing the ninja build manifest to get stuck in an infinite loop during compilation.

**Solution**: Remove the corrupted CMake cache and rebuild.

### 2. Deprecated `newArchEnabled=false` Flag
The `newArchEnabled` property in gradle.properties was deprecated in favor of making the New Architecture the default in modern React Native versions.

**Solution**: Updated to `newArchEnabled=true` in `gradle.properties`.

---

## Changes Made

### ✅ Fix 1: Updated gradle.properties
- **File**: `android/gradle.properties`
- **Change**: Added `newArchEnabled=true` to enable the new architecture
- **Why**: Required for react-native-reanimated v3+ and modern React Native architecture

### ✅ Fix 2: Created CMake Cache Cleanup Scripts
Two cleanup scripts have been created in the `android/` directory:

1. **`clean-cmake-cache.bat`** (Windows batch script)
   - Use this on Windows Command Prompt
   - Run: `cd android && clean-cmake-cache.bat`

2. **`clean-cmake-cache.ps1`** (PowerShell script)
   - Use this on Windows PowerShell
   - Run: `cd android && .\clean-cmake-cache.ps1`

---

## How to Fix the Build

### Quick Fix (Recommended)
1. Open PowerShell or Command Prompt
2. Navigate to the `android` directory:
   ```bash
   cd android
   ```
3. Run the cleanup script:
   ```powershell
   # PowerShell
   .\clean-cmake-cache.ps1
   
   # OR Command Prompt
   clean-cmake-cache.bat
   ```
4. Rebuild your project:
   ```bash
   ./gradlew clean build
   # or from project root:
   react-native run-android
   ```

### Manual Fix (If Scripts Don't Work)
Delete these directories manually:
- `android/build`
- `android/app/build`
- `android/.gradle`
- `android/app/.cxx`
- `node_modules/react-native-reanimated/android/.cxx`

Then run:
```bash
./gradlew clean build
```

---

## Verify the Fix

After cleaning and rebuilding:
1. Check that `android/gradle.properties` contains `newArchEnabled=true`
2. Rebuild should complete without ninja build manifest errors
3. The app should build and run successfully

---

## Related Files
- [gradle.properties](../gradle.properties) - Contains build configuration
- [clean-cmake-cache.ps1](./clean-cmake-cache.ps1) - PowerShell cleanup script
- [clean-cmake-cache.bat](./clean-cmake-cache.bat) - Batch cleanup script

## References
- React Native Reanimated Documentation
- React Native New Architecture Guide
