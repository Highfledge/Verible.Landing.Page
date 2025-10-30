# Verible API Integration Setup

## API Information
- **Base URL**: `https://verible-backend.vercel.app`
- **Documentation**: [Postman Collection](https://documenter.getpostman.com/view/36179911/2sB3QMK8Z5#620f27da-eb25-4320-bbc4-beddb661fa45)

## Quick Start

### 1. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://verible-backend.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://verible-backend.vercel.app
```

### 2. Install Dependencies
```bash
npm install openapi-typescript --save-dev
```

### 3. Generate Types

**Option A: From Postman Collection (Recommended)**
```bash
# Install quicktype if not already installed
npm install quicktype --save-dev

# Generate types from your Postman collection
npm run generate:api:postman
```

**Option B: From OpenAPI Spec (if available)**
```bash
# If your API exposes OpenAPI spec
npm run generate:api

# Or from local OpenAPI file
npm run generate:api:local
```

### 4. Verify Types
Check that `lib/api/generated/types.ts` contains your API types.

## API Endpoints (from Postman docs)

Based on your [Postman documentation](https://documenter.getpostman.com/view/36179911/2sB3QMK8Z5#620f27da-eb25-4320-bbc4-beddb661fa45), you likely have:

- **Authentication**
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `POST /auth/refresh` - Refresh token
  - `POST /auth/logout` - User logout

- **User Management**
  - `GET /user/profile` - Get user profile
  - `PUT /user/profile` - Update user profile

- **Trust/Seller Verification**
  - `GET /sellers` - List sellers
  - `GET /sellers/:id` - Get seller details
  - `POST /sellers/verify` - Verify seller

## Next Steps

1. Generate types from your API
2. Set up Axios client with your base URL
3. Create TanStack Query hooks
4. Integrate with your auth forms

## Troubleshooting

### If OpenAPI spec is not available at `/openapi.json`:
1. Export Postman collection as OpenAPI 3.0
2. Save as `api-spec.yaml`
3. Run `npm run generate:api:local`

### If types are not generating:
- Check that your API is accessible
- Verify the OpenAPI spec format
- Check console for error messages
