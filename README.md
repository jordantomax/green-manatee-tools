# Green Manatee Tools Platform

A React application that provides a unified interface for interacting with various third-party APIs through our backend service. The platform supports multiple integrations including shipping (Shippo), productivity (Notion), and Amazon services (Seller Central, Advertising).

## Development

### Prerequisites
- Node.js 22+
- AWS CLI configured
- Just command runner

### Environment Variables
The application uses different environment configurations based on the `ENV` variable:
- `dev`: Local development
- `staging`: Staging environment
- `prod`: Production environment

Required environment variables:
- `API_BASE_URL`: Base URL for the backend API service

### Local Development
```bash
npm install
npm start
```

### Building
```bash
ENV=<environment> npm run build
```

## Deployment

The application is deployed to AWS using CloudFront and S3. Infrastructure is managed using AWS SAM.

### Manual Deployment
```bash
# Deploy infrastructure
just env=<environment> infra

# Deploy application
just env=<environment> deploy
```

### CI/CD
The application is automatically deployed to production when changes are pushed to the main branch using GitHub Actions.

## Hosted Version
The application is hosted at [https://tools.thegreenmanatee.com](https://tools.thegreenmanatee.com).

## Contributing
Contributions are welcome! Please file an issue for specific changes or improvements.
