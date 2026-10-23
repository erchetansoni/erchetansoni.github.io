---
title: "Building Zero-Trust Cloud Infrastructure with Terraform and AWS"
pubDatetime: 2026-03-28T10:00:00.000Z
modDatetime: 2026-03-29T14:15:00.000Z
author: "Chetan Soni"
description: "Enforcing least-privilege IAM policies, encrypted network boundaries, and automated compliance with Infrastructure as Code."
featured: false
draft: false
tags:
  - terraform
  - aws
  - security
  - iac
category: "Infrastructure"
categories:
  - "Infrastructure"
  - "Security"
---

The core premise of zero-trust architecture is "never trust, always verify." When translating this philosophy to cloud environments, every workload, subnet, and microservice identity must explicitly demonstrate authentication and authorization for every network transaction.

## Table of contents

## Principles of Zero-Trust Infrastructure

1. **Explicit Identity Verification:** Assign short-lived IAM roles with OpenID Connect (OIDC) rather than long-lived API keys.
2. **Micro-Segmentation:** Isolate compute nodes into strict security groups denying all ingress by default.
3. **End-to-End Encryption:** Enforce KMS encryption in transit (TLS 1.3) and at rest across all datastores.

## Terraform Blueprint: Enforcing Least Privilege

Below is a declarative Terraform HCL definition provisioning a private EKS cluster VPC with private subnet routing and strict VPC endpoints:

```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40.0"
    }
  }
}

locals {
  environment = "production"
  vpc_cidr    = "10.100.0.0/16"
}

resource "aws_vpc" "zero_trust_vpc" {
  cidr_block           = local.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${local.environment}-zero-trust-vpc"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# Restrict default security group to drop all inbound and outbound traffic
resource "aws_default_security_group" "default" {
  vpc_id = aws_vpc.zero_trust_vpc.id

  tags = {
    Name = "${local.environment}-default-sg-locked"
  }
}

# Enforce S3 VPC Gateway endpoint to avoid internet egress
resource "aws_vpc_endpoint" "s3_endpoint" {
  vpc_id       = aws_vpc.zero_trust_vpc.id
  service_name = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"

  tags = {
    Name = "${local.environment}-s3-vpc-endpoint"
  }
}
```

## Security Group Matrix

| Port | Protocol | Source | Purpose | Action |
|---|---|---|---|---|
| **443** | TCP | Internal VPC CIDR | Secure API gateway traffic | **ALLOW** |
| **8080** | TCP | Ingress Controller | Internal microservices proxy | **ALLOW** |
| **All** | ALL | 0.0.0.0/0 | Public internet access | **DENY** |

## Verification and Policy as Code

Integrate policy-as-code validation tools such as `tfsec` or `trivy` into continuous integration pipelines to catch compliance violations before provisioning:

```bash
# Run security analysis against Terraform code
trivy config ./terraform/

# Verify drift and plan output
terraform plan -out=tfplan.binary
```
