---
title: "Implementing GitOps Continuous Delivery with ArgoCD and Kubernetes"
pubDatetime: 2026-03-22T09:00:00.000Z
modDatetime: 2026-03-24T12:00:00.000Z
author: "Chetan Soni"
description: "A comprehensive guide to declarative cluster state, automated sync policies, and drift detection in production environments."
featured: true
draft: false
tags:
  - gitops
  - argocd
  - kubernetes
  - ci-cd
category: "DevOps"
categories:
  - "DevOps"
  - "CI/CD"
---

GitOps treats Git repositories as the sole source of truth for declared infrastructure and application state. By deploying an in-cluster agent like ArgoCD, teams eliminate manual `kubectl apply` commands, guarantee auditability, and automatically remediate configuration drift.

## Table of contents

## GitOps Lifecycle Workflow

The continuous delivery sequence illustrates how a Git commit triggers automated reconciliation without granting continuous deployment pipelines direct ingress access into the cluster:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Platform Engineer
    participant Git as Git Repository (Source of Truth)
    participant CI as GitHub Actions (CI & Tests)
    participant Argo as ArgoCD Controller (In-Cluster)
    participant K8s as Kubernetes API Server

    Dev->>Git: Commit updated deployment manifest
    Git->>CI: Trigger lint, test & image scan
    CI-->>Git: Report status checks (Passed)
    Note over Argo,Git: ArgoCD polls or receives webhook
    Argo->>Git: Fetch desired state manifests
    Argo->>K8s: Compare live cluster state with desired state
    alt State Drift Detected
        Argo->>K8s: Apply patch / sync resources
        K8s-->>Argo: Resources updated & healthy
        Argo-->>Dev: Notify Slack / Teams (Synced)
    else State Matches
        Argo-->>Dev: Cluster in sync (No action)
    end
```

## Declarative ArgoCD Application Manifest

Here is a production-grade ArgoCD `Application` Custom Resource Definition that targets an automated sync policy with automated pruning and self-healing:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: microservices-production
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/ErChetanSoni/production-manifests.git
    targetRevision: HEAD
    path: environments/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
      - ApplyOutOfSyncOnly=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

## CLI Verification and Drift Inspection

Engineers can interact with the ArgoCD control plane directly via the CLI:

```bash
# Log in to the ArgoCD server instance
argocd login cd.internal.infra:443 --sso

# Inspect current application health and synchronization status
argocd app get microservices-production

# Trigger manual synchronization if automated sync is paused
argocd app sync microservices-production --prune

# Review resource diff between Git and live cluster
argocd app diff microservices-production
```

## Summary of Benefits

- **Zero Direct Cluster Access:** CI runners no longer require administrative cluster credentials.
- **Instant Rollbacks:** Reverting a release is as fast and clean as `git revert <commit-sha>`.
- **Automated Drift Remediation:** If someone modifies a live resource manually, ArgoCD promptly restores the Git-defined truth.
