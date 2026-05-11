# Zora JDM Backend

Backend API untuk aplikasi Zora JDM - platform jual beli mobil JDM.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Package Manager**: npm

## Setup

### Prerequisites

- Node.js v18+
- npm atau yarn
- MongoDB (local atau cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Update `.env` dengan konfigurasi Anda:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/zora-jdm
FRONTEND_URL=http://localhost:3000
API_VERSION=v1
```

## Development

### Start development server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Build untuk production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Lint TypeScript:
```bash
npm run lint
```

## Project Structure

```
src/
├── index.ts           # Entry point
├── config/            # Configuration files
├── controllers/       # Request handlers
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── services/         # Business logic
└── utils/            # Utility functions
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Version
- `GET /api/version` - Get API version

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/zora-jdm |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| API_VERSION | API version | v1 |

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## License

ISC
