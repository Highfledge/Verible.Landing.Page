#!/usr/bin/env node
/**
 * OpenAPI Type Generation Script
 * 
 * This script generates TypeScript types from OpenAPI specifications.
 * Supports both remote URLs and local files.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://verible-backend.vercel.app';
const OUTPUT_PATH = './lib/api/generated/types.ts';
const LOCAL_SPEC_YAML = './api-spec.yaml';
const LOCAL_SPEC_JSON = './api-spec.json';

function generateTypes(source, output = OUTPUT_PATH) {
  try {
    console.log(`🔄 Generating types from: ${source}`);
    execSync(`openapi-typescript "${source}" -o "${output}"`, {
      stdio: 'inherit',
    });
    console.log(`✅ Types generated successfully at: ${output}`);
  } catch (error) {
    console.error('❌ Error generating types:', error.message);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'local' || command === '--local') {
  // Use local YAML file
  if (fs.existsSync(LOCAL_SPEC_YAML)) {
    generateTypes(LOCAL_SPEC_YAML);
  } else if (fs.existsSync(LOCAL_SPEC_JSON)) {
    generateTypes(LOCAL_SPEC_JSON);
  } else {
    console.error('❌ No local spec file found. Expected:', LOCAL_SPEC_YAML, 'or', LOCAL_SPEC_JSON);
    process.exit(1);
  }
} else if (command === 'remote' || command === '--remote') {
  // Use remote URL
  const url = args[1] || `${API_URL}/openapi.json`;
  generateTypes(url);
} else {
  // Default: try remote first, fallback to local
  console.log(`🔍 Checking for remote API: ${API_URL}/openapi.json`);
  try {
    generateTypes(`${API_URL}/openapi.json`);
  } catch (error) {
    console.log(`⚠️  Remote failed, trying local files...`);
    if (fs.existsSync(LOCAL_SPEC_YAML)) {
      generateTypes(LOCAL_SPEC_YAML);
    } else if (fs.existsSync(LOCAL_SPEC_JSON)) {
      generateTypes(LOCAL_SPEC_JSON);
    } else {
      console.error('❌ No API source found. Please specify:');
      console.log('  npm run generate:api:local - for local file');
      console.log('  npm run generate:api:remote <url> - for remote URL');
      process.exit(1);
    }
  }
}
