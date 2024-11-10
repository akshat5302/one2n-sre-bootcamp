

# CRUD API Helm Chart

This Helm chart deploys a Student CRUD API application with PostgreSQL database and external secrets management using HashiCorp Vault.

## Prerequisites

- Kubernetes cluster 1.19+
- Helm 3.0+
- External Secrets Operator installed
- HashiCorp Vault installed and configured
- Storage class available for PostgreSQL persistence

## Installation

### 1. Create Vault Token Secret

First, you need to create a Kubernetes secret containing the Vault token. This token should be generated during the Vault initialization process using the `vault operator init` command as described in the [vault-setup documentation](https://github.com/akshat5302/one2n-sre-bootcamp/blob/main/charts/vault/README.md#installation).

```bash
kubectl create secret generic vault-token-secret \
  --from-literal=vault-token=<your-vault-token> \
  -n student-api
```

Replace `<your-vault-token>` with your actual Vault token that starts with `hvs.`.

### 2. Install Helm Chart

Once the Vault token secret is created, install the chart with the release name `student-crud-api`:

```bash
helm upgrade --install student-crud-api crud-api/ -n student-api --create-namespace
```

## Architecture Components

The Helm chart deploys the following components:

1. Student CRUD API application
2. PostgreSQL database (optional local setup)
3. External Secrets configuration for Vault integration
4. SecretStore for Vault backend
5. Ingress configuration




## Vault Secret Path

Ensure the following secrets are stored in Vault at the path `kv/postgres-secret`:
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- DATABASE_URL

## Node Selector and Tolerations

The chart supports node selection and tolerations for both API and database components:

- API pods are scheduled on nodes with label `type: application`
- Database pods are scheduled on nodes with label `type: database`

## Storage

PostgreSQL uses persistent volume claims with the following defaults:
- Storage Class: `standard`
- Volume Size: `1Gi`

## Dependencies

This chart requires the following components to be installed in the cluster:

1. External Secrets Operator
2. HashiCorp Vault (Follow the installation guide at [vault-setup documentation](https://github.com/akshat5302/one2n-sre-bootcamp/blob/main/charts/vault/README.md#installation))
3. Ingress Controller (nginx)

## Troubleshooting

Common issues and their solutions:

1. External Secrets not syncing:
   - Verify Vault token secret is created correctly
   - Check Vault connection and token permissions
   - Ensure SecretStore configuration is correct
   - Verify secret paths in Vault match the configuration

2. Database connection issues:
   - Verify PostgreSQL pod is running
   - Check secret values are correctly populated
   - Verify DATABASE_URL format

3. Ingress not working:
   - Verify ingress controller is running
   - Check DNS configuration
   - Validate TLS configuration if enabled

## Maintenance

### Upgrading

To upgrade the release:

```bash
helm upgrade student-crud-api crud-api/ -n student-api
```

### Uninstallation

To uninstall/delete the deployment:

```bash
helm uninstall student-crud-api -n student-api
```

Note: This will not delete the PersistentVolumeClaims used by PostgreSQL.

## Contributing

Please submit issues and pull requests to improve the chart.