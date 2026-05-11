# React Native Reanimated RC Compiler Fix

## Problem
The build was failing with the following error:
```
CMake Error: CMAKE_RC_COMPILER not set, after EnableLanguage
ninja: error: rebuilding 'build.ninja': subcommand failed
```

This is a known issue with react-native-reanimated on Windows where the RC (Resource Compiler) is not properly configured in CMake.

## Changes Made

### 1. Created CMakeLists.txt
Added a CMakeLists.txt file in the android directory that:
- Enables RC (Resource Compiler) language
- Automatically finds and sets the RC compiler path on Windows
- Sets C++ standard to 17

### 2. Updated app/build.gradle
Added CMake configuration to the defaultConfig block:
```groovy
externalNativeBuild {
    cmake {
        cppFlags "-std=c++17"
        arguments "-DANDROID_STL=c++_shared"
    }
}
```

### 3. Updated gradle.properties
Added the following configurations:
- Enabled Hermes (required for react-native-worklets): `hermesEnabled=true`
- Added CMake configuration fixes: `android.enableCmakeListingConfig=false`
- Enabled Jetifier: `android.enableJetifier=true`

### 4. Updated app/build.gradle
Added explicit Hermes configuration in the android block:
```groovy
android {
    // ... other configurations

    // Explicitly enable Hermes for react-native-worklets
    hermesEnabled = true

    // ... rest of the configuration
}
```

This ensures that react-native-worklets will use Hermes instead of JSC, which resolves the CMake linking error with `ReactAndroid::jsctooling`.

## How to Rebuild Your Project

### Step 1: Clean the CMake Cache
Run the cleanup script that already exists in your project:

**Using PowerShell:**
```powershell
cd android
.\clean-cmake-cache.ps1
```

**Using Command Prompt:**
```cmd
cd android
clean-cmake-cache.bat
```

### Step 2: Clean and Rebuild
From the project root directory, run:

```bash
cd android
./gradlew clean
cd ..
npm start
```

In a new terminal, run:

```bash
npx react-native run-android
```

### Alternative: Build Directly with Gradle
```bash
cd android
./gradlew clean
./gradlew assembleDebug
./gradlew installDebug
```

## Troubleshooting

### If the Build Still Fails
1. Make sure you have the Windows SDK installed
2. Verify that rc.exe is in your PATH
3. Try running the cleanup script again
4. Delete the entire node_modules folder and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

### If You Still Have Issues with Hermes
If you encounter Hermes-related issues, make sure:
1. Hermes is enabled in both gradle.properties and app/build.gradle
2. Your project is using the latest version of React Native
3. All dependencies are compatible with your React Native version

## Additional Notes
- These changes are specific to Windows builds
- The CMakeLists.txt file will help CMake find the RC compiler automatically
- The C++ standard is set to 17, which is required by react-native-reanimated 4.x
