#!/bin/bash
# Wait for deployment to complete and verify smoke tests pass
# Usage: ./scripts/wait-for-deploy.sh [commit_sha]

set -e

COMMIT="${1:-HEAD}"
COMMIT_SHA=$(git rev-parse "$COMMIT")
COMMIT_MSG=$(git log -1 --pretty=format:"%s" "$COMMIT_SHA")

echo "Waiting for deployment of: $COMMIT_MSG"
echo "Commit: $COMMIT_SHA"
echo ""

# Wait for Deploy to AWS workflow
echo "Checking Deploy to AWS..."
MAX_WAIT=120
WAITED=0

while true; do
    STATUS=$(gh run list --commit "$COMMIT_SHA" --workflow "Deploy to AWS" --json status,conclusion --jq '.[0] | "\(.status)|\(.conclusion)"' 2>/dev/null || echo "not_found|")

    IFS='|' read -r RUN_STATUS CONCLUSION <<< "$STATUS"

    if [ "$RUN_STATUS" = "completed" ]; then
        if [ "$CONCLUSION" = "success" ]; then
            echo "✅ Deploy to AWS: SUCCESS"
            break
        else
            echo "❌ Deploy to AWS: FAILED ($CONCLUSION)"
            exit 1
        fi
    elif [ "$RUN_STATUS" = "not_found" ]; then
        echo "Waiting for workflow to start..."
    else
        echo "Deploy status: $RUN_STATUS..."
    fi

    sleep 5
    WAITED=$((WAITED + 5))

    if [ $WAITED -ge $MAX_WAIT ]; then
        echo "❌ Timeout waiting for deployment"
        exit 1
    fi
done

# Wait for Smoke Tests workflow
echo ""
echo "Checking Smoke Tests..."
WAITED=0

while true; do
    STATUS=$(gh run list --commit "$COMMIT_SHA" --workflow "Smoke Tests" --json status,conclusion --jq '.[0] | "\(.status)|\(.conclusion)"' 2>/dev/null || echo "not_found|")

    IFS='|' read -r RUN_STATUS CONCLUSION <<< "$STATUS"

    if [ "$RUN_STATUS" = "completed" ]; then
        if [ "$CONCLUSION" = "success" ]; then
            echo "✅ Smoke Tests: SUCCESS"
            break
        else
            echo "❌ Smoke Tests: FAILED ($CONCLUSION)"
            exit 1
        fi
    elif [ "$RUN_STATUS" = "not_found" ]; then
        echo "Waiting for workflow to start..."
    else
        echo "Smoke Tests status: $RUN_STATUS..."
    fi

    sleep 5
    WAITED=$((WAITED + 5))

    if [ $WAITED -ge $MAX_WAIT ]; then
        echo "❌ Timeout waiting for smoke tests"
        exit 1
    fi
done

echo ""
echo "========================================="
echo "✅ DEPLOYMENT COMPLETE AND VERIFIED"
echo "========================================="
echo "Commit: $COMMIT_MSG"
echo "Live at: https://d148t8mrj9hw61.cloudfront.net"
echo ""
