# HashiCorp Vault Setup Guide

Quick guide for setting up HashiCorp Vault in Kubernetes using Helm.

## Installation

1. Install Vault using Helm:
```bash
helm upgrade --install vault-setup charts/vault-0.28.1.tgz -n vault --create-namespace
```

2. Initialize Vault to generate keys:
```bash
kubectl exec vault-setup-0 -n vault -- vault operator init \
    -key-shares=3 \
    -key-threshold=3 \
    -format=json > keys.json
```

## Visual Setup Guide

### 1. Initial Key Generation
![Vault Key Generation](../../assets/vault-init.png)

After initialization, Vault generates unseal keys and root token. **Keep these secure!**

### 2. Unsealing Process
![Vault Unseal Interface](../../assets/vault-unseal.png)
- Vault starts in a sealed state
- Requires key portions for unsealing
- Progress tracker shows keys provided (e.g., 2/3 keys)

### 3. Vault UI - Secrets Management
![Vault Secrets Engine](../../assets/vault-ui.png)
- Access the UI at `localhost:8200`
- Navigate to Secrets Engines section
- Manage different types of secrets

## Security Notes

- Store unseal keys securely
- Distribute keys to different team members
- Never store keys in version control
- Backup keys and root token safely

## Quick Verification

Check Vault status:
```bash
kubectl exec vault-setup-0 -n vault -- vault status
```

## Troubleshooting

If pods aren't starting:
```bash
kubectl describe pod vault-setup-0 -n vault
kubectl logs vault-setup-0 -n vault
```

For detailed configuration and advanced setup, refer to HashiCorp's official documentation.