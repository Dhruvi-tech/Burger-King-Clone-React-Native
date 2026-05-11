const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const patches = [
  {
    file: path.join(root, 'node_modules', 'react-native-reanimated', 'android', 'build.gradle'),
    marker: 'def REANIMATED_FEATURE_FLAGS = getReanimatedStaticFeatureFlags()',
  },
  {
    file: path.join(root, 'node_modules', 'react-native-worklets', 'android', 'build.gradle'),
    marker: 'def WORKLETS_PROFILING = safeExtGet("enableWorkletsProfiling", false)',
    fallbackMarker: 'def WORKLETS_PROFILING = safeAppExtGet("enableWorkletsProfiling", false)',
  },
];

const stagingLine = 'def shortNativeBuildDir = new File(System.getProperty("user.home"), ".rn-cxx/${rootProject.name}/${project.name}")';

for (const patch of patches) {
  if (!fs.existsSync(patch.file)) {
    continue;
  }

  let source = fs.readFileSync(patch.file, 'utf8');

  if (!source.includes(stagingLine)) {
    const marker = source.includes(patch.marker) ? patch.marker : patch.fallbackMarker;
    if (!marker || !source.includes(marker)) {
      throw new Error(`Unable to find insertion point in ${patch.file}`);
    }
    source = source.replace(marker, `${marker}\n${stagingLine}`);
  }

  if (!source.includes('buildStagingDirectory shortNativeBuildDir')) {
    const versionLine = 'version = System.getenv("CMAKE_VERSION") ?: "3.22.1"';
    if (!source.includes(versionLine)) {
      throw new Error(`Unable to find CMake version line in ${patch.file}`);
    }
    source = source.replace(versionLine, `buildStagingDirectory shortNativeBuildDir\n            ${versionLine}`);
  }

  if (!source.includes('task.name.startsWith("externalNativeBuildClean")')) {
    source += `

tasks.matching { task ->
    task.name.startsWith("externalNativeBuildClean")
}.configureEach { task ->
    task.doFirst {
        delete shortNativeBuildDir
    }
}
`;
  }

  fs.writeFileSync(patch.file, source);
}
