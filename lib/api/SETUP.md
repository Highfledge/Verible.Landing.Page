# OpenAPI Type Generation

## Setup Complete! ✅

### Next Steps:

1. **Install the package:**
   ```bash
   npm install openapi-typescript --save-dev
   ```

2. **Set your API URL in `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.verible.com
   ```

3. **Generate types:**
   ```bash
   npm run generate:api
   ```

### Available Commands:

- `npm run generate:api` - Generate from remote API (uses NEXT_PUBLIC_API_URL)
- `npm run generate:api:local` - Generate from local `api-spec.yaml`
- `npm run generate:api:json` - Generate from local `api-spec.json`

### Output:

Generated types will be available at:
- `lib/api/generated/types.ts`

### Usage:

```typescript
import type { LoginRequest, LoginResponse, User } from '@/lib/api/generated/types';
// or use the convenience export:
import type { LoginRequest, LoginResponse, User } from '@/lib/api/types';
```

### Notes:

- Types are auto-generated - **DO NOT edit manually**
- Re-run generation when API schema changes
- Types are fully typed and provide IntelliSense support
- Works seamlessly with TanStack Query and Axios
