# OpenAPI Type Generation

This directory contains auto-generated TypeScript types from your OpenAPI specification.

## Generating Types

### Option 1: From Remote API
```bash
npm run generate:api
```

This fetches the OpenAPI spec from your API endpoint and generates types.

### Option 2: From Local File
```bash
npm run generate:api:local
```

This uses a local `api-spec.yaml` file in the project root.

## Usage

After generating types, import them in your code:

```typescript
import type { LoginRequest, LoginResponse, User } from '@/lib/api/generated/types';
```

## Notes

- **Never edit generated files manually** - They will be overwritten on regeneration
- Run `npm run generate:api` whenever your API schema changes
- Types are automatically available for use in queries, mutations, and components
