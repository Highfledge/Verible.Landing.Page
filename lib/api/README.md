# OpenAPI Type Generation Configuration

This configuration file is used by openapi-typescript to generate TypeScript types from your OpenAPI specification.

## Usage

### From Remote API
```bash
npm run generate:api
```

This will fetch the OpenAPI spec from `NEXT_PUBLIC_API_URL/openapi.json` and generate types.

### From Local File
```bash
npm run generate:api:local
```

This will use a local `api-spec.yaml` file in the root directory.

## Environment Variables

Make sure to set in your `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.verible.com
```

## Output

Generated types will be available at:
- `lib/api/generated/types.ts`

## Integration

After generating types, import them in your code:
```typescript
import type { LoginRequest, LoginResponse, User } from '@/lib/api/generated/types';
```
