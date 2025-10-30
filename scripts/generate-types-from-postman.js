#!/usr/bin/env node
/**
 * Generate TypeScript types from Postman Collection
 * 
 * This script uses quicktype to convert Postman collection JSON to TypeScript types.
 * Make sure quicktype is installed: npm install quicktype --save-dev
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const POSTMAN_COLLECTION = './verible-collection.json';
const OUTPUT_PATH = './lib/api/generated/types.ts';

console.log('🚀 Generating TypeScript types from Postman Collection');
console.log('======================================================');
console.log('');

// Check if collection exists
if (!fs.existsSync(POSTMAN_COLLECTION)) {
  console.error(`❌ Error: Postman collection not found at ${POSTMAN_COLLECTION}`);
  console.log('');
  console.log('Please make sure you have exported your Postman collection as:');
  console.log('  - File name: verible-collection.json');
  console.log('  - Format: Collection v2.1');
  console.log('  - Location: Project root directory');
  process.exit(1);
}

console.log(`✅ Found Postman collection: ${POSTMAN_COLLECTION}`);
console.log('');

// Check if quicktype is installed
try {
  require.resolve('quicktype');
} catch (e) {
  console.error('❌ Error: quicktype is not installed');
  console.log('');
  console.log('Please install it first:');
  console.log('  npm install quicktype --save-dev');
  console.log('');
  process.exit(1);
}

console.log('🔄 Generating TypeScript types...');
console.log('');

try {
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Run quicktype
  execSync(
    `quicktype -s postman "${POSTMAN_COLLECTION}" -o "${OUTPUT_PATH}"`,
    { stdio: 'inherit' }
  );

  console.log('');
  console.log(`✅ Types generated successfully!`);
  console.log(`   Output: ${OUTPUT_PATH}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Review the generated types in lib/api/generated/types.ts');
  console.log('   2. Import types: import type { ... } from "@/lib/api/generated/types"');
  console.log('   3. Use types in your API client and forms');
  console.log('');

} catch (error) {
  console.error('');
  console.error('❌ Error generating types:', error.message);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log('   - Make sure quicktype is installed: npm install quicktype --save-dev');
  console.log('   - Verify your Postman collection is valid JSON');
  console.log('   - Try exporting the collection again from Postman');
  console.log('');
  process.exit(1);
}
