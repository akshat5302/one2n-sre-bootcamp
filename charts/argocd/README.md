# ArgoCD Installation Guide

This guide explains how to install ArgoCD using Helm and set up a root application for managing other applications.

## Prerequisites

- Kubernetes cluster
- Helm 3.x installed
- `kubectl` configured to communicate with your cluster
- Git repository for your applications

## Installation Steps

### 1. Add ArgoCD Helm Repository

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
```

### 2. Create values.yaml

Create a `values.yaml` file with the following content:

```yaml
argo-cd:
  global:
    nodeSelector:
      type: dependent_services
    tolerations:
      - key: "type"
        operator: "Equal"
        value: "dependent_services"
        effect: "NoSchedule"
  dex:
    enabled: false
  notifications:
    enabled: false
  applicationSet:
    enabled: false
  server:
    extraArgs:
      - --insecure
```

### 3. Install ArgoCD

```bash
helm upgrade --install argocd . \
  --values values.yaml \
  --namespace argocd --create-namespace
```

This command will:
- Create the argocd namespace if it doesn't exist
- Install ArgoCD if it's not present
- Upgrade ArgoCD if it's already installed
- Apply the configuration from values.yaml

### 4. Create Root Application

Create a file named `root-app.yaml`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: <YOUR_GIT_REPO_URL>    # Replace with your Git repo URL
    targetRevision: HEAD
    path: applications              # Path to your applications directory
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Apply the root application:

```bash
kubectl apply -f root-app.yaml
```

### 5. Verify Installation

```bash
# Check if all pods are running
kubectl get pods -n argocd

# Get the ArgoCD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### 6. Access ArgoCD UI

For development environments, you can use port-forwarding:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:80
```

Access the UI at: http://localhost:8080
- Username: admin
- Password: (obtained from step 5)

## Directory Structure

Your repository should look like this:

```
.
├── applications/           # Directory containing all Application manifests
│   ├── app1.yaml
│   ├── app2.yaml
│   └── app3.yaml
└── root-app.yaml          # Root application manifest
```

## Application Template

For each application in the `applications` directory, use this template:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <app-name>
  namespace: argocd
spec:
  project: default
  source:
    repoURL: <application-repo-url>
    targetRevision: HEAD
    path: <path-to-manifests>
  destination:
    server: https://kubernetes.default.svc
    namespace: <target-namespace>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Common Issues and Solutions

1. **Applications not syncing:**
   - Verify Git repository access
   - Check application path is correct
   - Ensure manifests are valid YAML

2. **Access Issues:**
   - Verify network policies allow ArgoCD to access your Git repository
   - Check if required secrets are configured for private repositories

3. **Sync Errors:**
   - Check application logs: `kubectl logs -n argocd deployment/argocd-application-controller`
   - Verify destination namespace exists
   - Ensure RBAC permissions are correctly configured

## Maintenance

- Regularly update ArgoCD:
  ```bash
  helm repo update
  helm upgrade argocd argo/argo-cd -n argocd -f values.yaml
  ```
- Monitor ArgoCD logs for issues
- Keep track of application sync status through the UI or CLI

## Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Helm Chart Documentation](https://github.com/argoproj/argo-helm)
- [Best Practices Guide](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)