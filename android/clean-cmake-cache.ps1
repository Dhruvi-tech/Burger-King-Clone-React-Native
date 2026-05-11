# Clean React Native Reanimated CMake cache corruption
# This script removes the corrupted CMake cache that can cause ninja build manifest loops

Write-Host "Cleaning CMake cache and build artifacts..." -ForegroundColor Green
Write-Host ""

# Remove build directories
if (Test-Path "build") {
    Write-Host "Removing android/build directory..."
    Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove app build directory
if (Test-Path "app\build") {
    Write-Host "Removing android/app/build directory..."
    Remove-Item -Path "app\build" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove .gradle cache
if (Test-Path ".gradle") {
    Write-Host "Removing .gradle cache..."
    Remove-Item -Path ".gradle" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove app native build cache
if (Test-Path "app\.cxx") {
    Write-Host "Removing android/app/.cxx cache..."
    Remove-Item -Path "app\.cxx" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove node_modules cache for react-native-reanimated (actual location is android/.cxx)
$reanimatedAndroidCxx = "..\node_modules\react-native-reanimated\android\.cxx"
if (Test-Path $reanimatedAndroidCxx) {
    Write-Host "Removing react-native-reanimated/android/.cxx cache..."
    Remove-Item -Path $reanimatedAndroidCxx -Recurse -Force -ErrorAction SilentlyContinue
}

# Back-compat: some setups also create a top-level .cxx folder
$reanimatedCxx = "..\node_modules\react-native-reanimated\.cxx"
if (Test-Path $reanimatedCxx) {
    Write-Host "Removing react-native-reanimated/.cxx cache..."
    Remove-Item -Path $reanimatedCxx -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove the shortened native build cache configured in android/build.gradle
$shortNativeBuildDir = Join-Path $env:USERPROFILE ".rn-cxx\BurgerKing"
if (Test-Path $shortNativeBuildDir) {
    Write-Host "Removing short native build cache..."
    Remove-Item -Path $shortNativeBuildDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "CMake cache cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Run: .\gradlew clean build"
Write-Host "  2. Or: react-native run-android"
