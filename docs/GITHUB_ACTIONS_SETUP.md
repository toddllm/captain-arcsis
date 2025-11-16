# GitHub Actions CI/CD Setup Guide

This guide walks you through setting up GitHub Actions for automatic deployment to AWS.

## Prerequisites

Before setting up the workflow, ensure you have:
1. AWS infrastructure created (see [AWS_INFRASTRUCTURE.md](./AWS_INFRASTRUCTURE.md))
2. Access to the GitHub repository settings
3. AWS IAM credentials for the `captain-arcsis-github-actions` user

## Step 1: Configure GitHub Secrets

Navigate to your repository on GitHub:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | IAM user access key ID |
| `AWS_SECRET_ACCESS_KEY` | `LWaz...` | IAM user secret access key |

**Security Note**: These credentials are stored encrypted and are only exposed to workflows.

## Step 2: Create GitHub Actions Workflow

Create the workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main
  workflow_dispatch:  # Allow manual triggers

env:
  AWS_REGION: us-east-1
  S3_BUCKET: captain-arcsis-717984198385
  CLOUDFRONT_DISTRIBUTION_ID: E2K4437PWO7HA8

jobs:
  deploy:
    name: Deploy to S3 and CloudFront
    runs-on: ubuntu-latest

    permissions:
      contents: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Sync files to S3
        run: |
          aws s3 sync . s3://${{ env.S3_BUCKET }} \
            --exclude ".git/*" \
            --exclude ".github/*" \
            --exclude "docs/*" \
            --exclude "aws/*" \
            --exclude "*.md" \
            --exclude ".gitignore" \
            --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ env.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

      - name: Output deployment URL
        run: |
          echo "🎮 Game deployed successfully!"
          echo "URL: https://d148t8mrj9hw61.cloudfront.net"
```

## Step 3: Verify Workflow Permissions

The workflow uses minimal permissions:
- `contents: read` - Only reads repository contents
- AWS credentials scoped to specific S3 bucket and CloudFront distribution

## Step 4: Test the Deployment

### Manual Trigger
1. Go to **Actions** tab in your repository
2. Select "Deploy to AWS" workflow
3. Click **Run workflow** → **Run workflow**

### Automatic Trigger
Push to the `main` branch:
```bash
git add .
git commit -m "Trigger deployment"
git push origin main
```

## Workflow Features

### What Gets Deployed
- `index.html` - Main game file
- `js/` - All JavaScript modules
- `*.wav` - Audio files

### What Gets Excluded
- `.git/` - Git metadata
- `.github/` - GitHub configuration
- `docs/` - Documentation
- `aws/` - AWS configuration files
- `*.md` - Markdown files
- `.gitignore` - Git ignore file

### Deployment Process
1. **Checkout**: Gets latest code from repository
2. **Configure AWS**: Sets up credentials from secrets
3. **Sync to S3**: Uploads files, deletes removed files
4. **Invalidate Cache**: Clears CloudFront cache for immediate updates

## Monitoring Deployments

### GitHub Actions
- View workflow runs: **Actions** tab
- Check logs for each step
- See deployment status badges

### AWS Console
- **S3**: Check uploaded files in bucket
- **CloudFront**: Monitor invalidation status
- **CloudWatch**: View access logs (if enabled)

## Troubleshooting

### Common Issues

**Deployment fails with "Access Denied"**
- Verify AWS credentials are correct in GitHub secrets
- Check IAM policy is attached to user
- Ensure bucket name and distribution ID are correct

**Files not updating on website**
- CloudFront cache invalidation can take 1-2 minutes
- Check invalidation status in CloudFront console
- Try hard refresh (Ctrl+F5) in browser

**Workflow not triggering**
- Verify branch name matches workflow trigger
- Check workflow file syntax (YAML is space-sensitive)
- Ensure Actions are enabled for repository

### Debug Commands

```bash
# Verify S3 bucket contents
aws s3 ls s3://captain-arcsis-717984198385/

# Check CloudFront invalidation status
aws cloudfront list-invalidations --distribution-id E2K4437PWO7HA8

# Test S3 sync locally
aws s3 sync . s3://captain-arcsis-717984198385 --dryrun \
  --exclude ".git/*" --exclude ".github/*" --exclude "docs/*"
```

## Next Steps

After setting up the basic workflow, consider:

1. **Add branch protection rules** - Require PR reviews before merging to main
2. **Add deployment environments** - Staging vs Production
3. **Add health checks** - Verify site is accessible after deployment
4. **Add notifications** - Slack/Discord alerts on deployment
5. **Add custom domain** - Route 53 + ACM certificate
6. **Add monitoring** - CloudWatch alarms for errors

## Security Recommendations

1. **Rotate credentials regularly** - Update AWS access keys every 90 days
2. **Monitor usage** - Check CloudTrail for unexpected API calls
3. **Enable MFA** - Add MFA to IAM user if possible
4. **Use OIDC** - Consider AWS OIDC provider for keyless authentication (advanced)

## Reference

- [AWS CLI S3 Sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html)
- [CloudFront Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
- [GitHub Actions AWS Credentials](https://github.com/aws-actions/configure-aws-credentials)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
