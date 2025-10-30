#!/usr/bin/env node
/**
 * Postman to OpenAPI Type Generation Helper
 * 
 * This script helps convert Postman collections to OpenAPI specs
 * and generate TypeScript types for the Verible API.
 */

const fs = require('fs');
const path = require('path');

const POSTMAN_COLLECTION_URL = 'https://documenter.getpostman.com/view/36179911/2sB3QMK8Z5#620f27da-eb25-4320-bbc4-beddb661fa45';
const API_BASE_URL = 'https://verible-backend.vercel.app';

console.log('🚀 Verible API Type Generation Helper');
console.log('=====================================');
console.log('');
console.log('📋 Your API Information:');
console.log(`   Base URL: ${API_BASE_URL}`);
console.log(`   Documentation: ${POSTMAN_COLLECTION_URL}`);
console.log('');

console.log('📝 Steps to generate types:');
console.log('');
console.log('1. Export OpenAPI spec from Postman:');
console.log('   - Go to your Postman collection');
console.log('   - Click "..." → "Export"');
console.log('   - Choose "OpenAPI 3.0" format');
console.log('   - Save as "api-spec.yaml" in project root');
console.log('');

console.log('2. Generate TypeScript types:');
console.log('   npm run generate:api:local');
console.log('');

console.log('3. Alternative - if your API has OpenAPI endpoint:');
console.log('   npm run generate:api');
console.log('');

console.log('📁 Expected file structure:');
console.log('   project-root/');
console.log('   ├── api-spec.yaml          # Your exported OpenAPI spec');
console.log('   └── lib/api/generated/');
console.log('       └── types.ts           # Generated TypeScript types');
console.log('');

console.log('🔧 Environment setup:');
console.log('   Create .env.local with:');
console.log('   NEXT_PUBLIC_API_URL=https://verible-backend.vercel.app');
console.log('');

// Check if api-spec.yaml exists
if (fs.existsSync('./api-spec.yaml')) {
  console.log('✅ Found api-spec.yaml - ready to generate types!');
  console.log('   Run: npm run generate:api:local');
} else {
  console.log('⚠️  api-spec.yaml not found');
  console.log('   Please export your Postman collection as OpenAPI 3.0 first');
}

console.log('');
console.log('📚 For more help, see: lib/api/VERIBLE_API_SETUP.md');
