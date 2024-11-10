# External Secrets Operator

## Quick Install
```bash
helm repo add external-secrets https://charts.external-secrets.io

helm repo update

helm install external-secrets external-secrets/external-secrets \
    -n external-secrets \
    --create-namespace
```

## Documentation
For detailed setup and usage, visit [external-secrets.io](https://external-secrets.io/latest/)