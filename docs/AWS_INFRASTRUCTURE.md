# AWS Infrastructure Documentation

This document describes the AWS infrastructure set up for deploying Captain Arcsis.

## Architecture Overview

```
GitHub Actions (CI/CD)
        |
        v
   S3 Bucket (Static Files)
        |
        v
CloudFront Distribution (CDN)
        |
        v
    End Users (HTTPS)
```

## AWS Resources

### S3 Bucket
- **Name**: `captain-arcsis-717984198385`
- **Region**: `us-east-1`
- **Purpose**: Static file hosting for game assets
- **Configuration**:
  - Static website hosting enabled
  - Index document: `index.html`
  - Error document: `index.html`
  - Public access blocked (CloudFront only)

### CloudFront Distribution
- **Distribution ID**: `E2K4437PWO7HA8`
- **Domain**: `d148t8mrj9hw61.cloudfront.net`
- **Origin Access Control ID**: `E1DNVUTN6KRLNQ`
- **Features**:
  - HTTPS only (redirect HTTP to HTTPS)
  - HTTP/2 and HTTP/3 enabled
  - Gzip compression enabled
  - PriceClass_100 (North America and Europe)
  - Custom error response: 404 → index.html (200)

### IAM Resources

#### Policy: `CaptainArcsisGitHubActionsPolicy`
- **ARN**: `arn:aws:iam::717984198385:policy/CaptainArcsisGitHubActionsPolicy`
- **Permissions** (Least Privilege):
  - S3: PutObject, GetObject, DeleteObject, ListBucket (bucket-scoped)
  - CloudFront: CreateInvalidation, GetInvalidation, ListInvalidations (distribution-scoped)

#### User: `captain-arcsis-github-actions`
- **Purpose**: Dedicated user for GitHub Actions CI/CD
- **Tags**: Purpose=GitHubActionsCI, Project=CaptainArcsis
- **Attached Policy**: CaptainArcsisGitHubActionsPolicy

## Security Features

1. **No Public S3 Access**: Bucket is not publicly accessible; only CloudFront can read via Origin Access Control
2. **Least Privilege IAM**: CI/CD user can only:
   - Upload/download/delete files in the specific S3 bucket
   - Invalidate cache on the specific CloudFront distribution
3. **HTTPS Enforced**: CloudFront redirects all HTTP traffic to HTTPS
4. **Origin Access Control**: Modern security mechanism for S3-CloudFront integration

## Cost Estimation

- **S3 Storage**: ~$0.023/GB/month (first 50TB)
- **S3 Requests**: ~$0.0004/1000 PUT requests
- **CloudFront**: ~$0.085/GB for first 10TB (North America/Europe)
- **Data Transfer**: First 1GB/month free

For a small static game (~6MB), estimated monthly cost: **< $1/month** with light usage.

## Deployment URL

Once deployed, the game will be accessible at:
- **Primary**: https://d148t8mrj9hw61.cloudfront.net
- **Custom Domain**: Can be added later via Route 53 + ACM certificate

## Resource Cleanup

To remove all resources (if needed):

```bash
# 1. Empty and delete S3 bucket
aws s3 rm s3://captain-arcsis-717984198385 --recursive
aws s3api delete-bucket --bucket captain-arcsis-717984198385

# 2. Delete CloudFront distribution (must disable first)
aws cloudfront get-distribution-config --id E2K4437PWO7HA8 --output json > dist-config.json
# Edit to set Enabled: false, then update
aws cloudfront update-distribution --id E2K4437PWO7HA8 --distribution-config file://dist-config.json --if-match <ETag>
# Wait for deployment, then delete
aws cloudfront delete-distribution --id E2K4437PWO7HA8 --if-match <ETag>

# 3. Delete Origin Access Control
aws cloudfront delete-origin-access-control --id E1DNVUTN6KRLNQ --if-match <ETag>

# 4. Delete IAM resources
aws iam delete-access-key --user-name captain-arcsis-github-actions --access-key-id <KeyId>
aws iam detach-user-policy --user-name captain-arcsis-github-actions --policy-arn arn:aws:iam::717984198385:policy/CaptainArcsisGitHubActionsPolicy
aws iam delete-user --user-name captain-arcsis-github-actions
aws iam delete-policy --policy-arn arn:aws:iam::717984198385:policy/CaptainArcsisGitHubActionsPolicy
```

## Configuration Files

All AWS configuration files are stored in the `/aws` directory:
- `cloudfront-config.json`: CloudFront distribution configuration
- `bucket-policy.json`: S3 bucket policy for CloudFront access
- `github-actions-policy.json`: IAM policy for CI/CD user

These files serve as documentation and can be used to recreate the infrastructure if needed.
