@echo off
REM Clean React Native Reanimated CMake cache corruption
REM This script removes the corrupted CMake cache that can cause ninja build manifest loops

echo Cleaning CMake cache and build artifacts...

REM Remove build directories
if exist "build" (
    echo Removing android/build directory...
    rmdir /s /q "build"
)

REM Remove app build directory
if exist "app\build" (
    echo Removing android/app/build directory...
    rmdir /s /q "app\build"
)

REM Remove .gradle cache
if exist ".gradle" (
    echo Removing .gradle cache...
    rmdir /s /q ".gradle"
)

REM Remove app native build cache
if exist "app\.cxx" (
    echo Removing android/app/.cxx cache...
    rmdir /s /q "app\.cxx"
)

REM Remove node_modules cache for react-native-reanimated (actual location is android/.cxx)
if exist "..\node_modules\react-native-reanimated\android\.cxx" (
    echo Removing react-native-reanimated/android/.cxx cache...
    rmdir /s /q "..\node_modules\react-native-reanimated\android\.cxx"
)

REM Back-compat: some setups also create a top-level .cxx folder
if exist "..\node_modules\react-native-reanimated\.cxx" (
    echo Removing react-native-reanimated/.cxx cache...
    rmdir /s /q "..\node_modules\react-native-reanimated\.cxx"
)

REM Remove the shortened native build cache configured in android/build.gradle
if exist "%USERPROFILE%\.rn-cxx\BurgerKing" (
    echo Removing short native build cache...
    rmdir /s /q "%USERPROFILE%\.rn-cxx\BurgerKing"
)

echo.
echo CMake cache cleanup completed!
echo You can now run: gradlew clean build
echo Or: react-native run-android
