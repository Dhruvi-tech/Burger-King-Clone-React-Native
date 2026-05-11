
# CMakeLists.txt for React Native project
# This file helps resolve CMake configuration issues with react-native-reanimated

cmake_minimum_required(VERSION 3.22.1)
project("BurgerKing")

# Enable RC (Resource Compiler) language
enable_language(RC)

# Set RC compiler if not already set
if(NOT CMAKE_RC_COMPILER)
    if(WIN32)
        # On Windows, try to find rc.exe in Windows SDK
        find_program(CMAKE_RC_COMPILER 
            NAMES rc.exe
            PATHS 
                "$ENV{WindowsSdkDir}/bin/$ENV{PROCESSOR_ARCHITECTURE}"
                "$ENV{WindowsSdkDir}/bin/x64"
                "$ENV{WindowsSdkDir}/bin/x86"
                "C:/Program Files (x86)/Windows Kits/10/bin/$ENV{PROCESSOR_ARCHITECTURE}"
                "C:/Program Files (x86)/Windows Kits/10/bin/x64"
                "C:/Program Files (x86)/Windows Kits/10/bin/x86"
                "C:/Program Files/Windows Kits/10/bin/$ENV{PROCESSOR_ARCHITECTURE}"
                "C:/Program Files/Windows Kits/10/bin/x64"
                "C:/Program Files/Windows Kits/10/bin/x86"
        )

        if(NOT CMAKE_RC_COMPILER)
            message(WARNING "RC compiler not found. Some features may not work properly.")
        endif()
    endif()
endif()

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
