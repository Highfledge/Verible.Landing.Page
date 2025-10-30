# OpenAPI Type Generation Guide

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://api.verible.com
```

### 3. Generate types

**From Remote API (default):**
```bash
npm run generate:api
```

**From Local YAML file:**
```bash
npm run generate:api:local
```

**From Local JSON file:**
```bash
npm run generate:api:json
```

## How It Works

1. **openapi-typescript** reads your OpenAPI specification
2. Generates TypeScript types automatically
3. Types are saved to `lib/api/generated/types.ts`
4. Types are ready to use in your codebase

## File Structure

```
lib/api/
├── generated/
│   ├── types.ts          # Auto-generated types (DO NOT EDIT)
│   └── README.md
├── client.ts             # Axios client configuration
├── queries.ts            # TanStack Query hooks
├── mutations.ts          # TanStack Query mutations
└── README.md
```

## Usage Example

After generating types:

```typescript
import type { LoginRequest, LoginResponse, User } from '@/lib/api/generated/types';

const loginMutation = useMutation({
  mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
    // Type-safe API call
  },
});
```

## Troubleshooting

### Types not generating?
- Check that your API URL is correct in `.env.local`
- Ensure the OpenAPI spec is accessible at `/openapi.json` endpoint
- For local files, ensure `api-spec.yaml` or `api-spec.json` exists in root

### Types outdated?
- Run `npm run generate:api` again after API changes
- Types are automatically updated

### Custom API URL?
```bash
NEXT_PUBLIC_API_URL=https://custom-api.com npm run generate:api
```
