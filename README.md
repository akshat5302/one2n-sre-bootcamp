# Student CRUD API

## Overview
This repository contains a Student Management API built with modern cloud-native principles. The application provides RESTful endpoints for managing student data, complete with infrastructure setup using Docker, Kubernetes, and a comprehensive observability stack.

## Components

### 1. Student API
A RESTful service that provides CRUD operations for student management:
- Create new student records
- Retrieve student information
- Update existing student details
- Delete student records
- Postgres database for data persistence

### 2. HashiCorp Vault
Enterprise-grade secrets management solution that provides secure storage and access control for tokens, passwords, certificates, and encryption keys - [https://www.vaultproject.io](https://www.vaultproject.io)

### 3. External Secrets Operator
Kubernetes operator that integrates external secret management systems like AWS Secrets Manager, HashiCorp Vault, and others with Kubernetes - [https://external-secrets.io](https://external-secrets.io)

### 4. ArgoCD
Declarative continuous delivery tool for Kubernetes that follows the GitOps methodology for cluster management and application deployment - [https://argoproj.github.io/cd](https://argoproj.github.io/cd)

### 5. Monitoring Stack
- **Prometheus**: Open-source metrics collection and alerting system that pulls metrics from instrumented jobs - [https://prometheus.io](https://prometheus.io)
- **Grafana**: Multi-platform analytics and interactive visualization web application for metrics visualization - [https://grafana.com](https://grafana.com)
- **Alert Manager**: Handles alerts sent by Prometheus server and takes care of deduplicating, grouping, and routing alerts - [https://prometheus.io/docs/alerting/latest/alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager)

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Kubernetes cluster
- Helm 3.8+
- kubectl

### Quick Start
1. Clone the repository:
```bash
git clone https://github.com/akshat5302/one2n-sre-bootcamp.git
```

2. Setup the environment variables:

```bash
chmod +x setup.sh
./setup.sh
```

3. Start the application:
```bash
docker compose up -d
```

This will start all necessary services including:
- Student API
- Postgres Database
- Monitoring stack

## Configuration

### Development Environment
The project includes:
- Dockerfile for containerization
- Makefile for common operations
- docker-compose.yml for local development
- Helm charts for Kubernetes deployment

### Kubernetes Deployment
Deployment is managed through Helm charts located in the `charts/` directory:
```
charts/
├── student-api/
├── vault/
├── external-secrets/
├── argocd/
└── monitoring/
```

## Usage

### API Endpoints
```
GET    /api/v1/students     # List all students
POST   /api/v1/students     # Create new student
GET    /api/v1/students/:id # Get student by ID
PUT    /api/v1/students/:id # Update student
DELETE /api/v1/students/:id # Delete student
```

### Accessing Services
After running `docker compose up -d`, services are available at:
- Student API: `http://localhost:8080`
- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- ArgoCD: `http://localhost:8080`

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support and bug reports, please create an issue in the GitHub repository.

## Documentation
For more detailed information about each component, please refer to the documentation in their respective directories:
- [API Documentation](README.md)
- [Deployment Guide](./charts/crud-api/README.md)
- [ArgoCD Setup](./charts/argocd/README.md)
- [Vault Setup](./charts/vault/README.md)
- [Monitoring Setup](./charts/monitoring/README.md)

## Project Status
This project is actively maintained and regularly updated. For the latest changes, please check the [CHANGELOG.md](./CHANGELOG.md).

## TODO's
~1. Add test cases for application~

~2. Update the CI pipeline with linting and test steps~

~3. Add an observability stack for Alerting and Logging~
   
4. Update README.md
