env := "staging"
app_name := "tools-frontend"
hosted_zone_id := "Z02535232655GYP1E8JFP"
certificate_arn := "arn:aws:acm:us-east-1:300119504737:certificate/8fbd30aa-24a6-46d7-9b7b-0a309faf8ca3" 

# Help
default:
    just --list

infra *args:
    sam deploy \
        --template-file infra/app.yaml \
        --stack-name {{ app_name }}-{{ env }} \
        --capabilities CAPABILITY_NAMED_IAM \
        --confirm-changeset \
        --parameter-overrides \
            Env={{ env }} \
            HostedZoneId={{ hosted_zone_id }} \
            CertificateArn={{ certificate_arn }} \
        {{ args }}


deploy:
    #!/usr/bin/env bash
    S3_BUCKET_NAME=$(just env={{ env }} get-output S3BucketName)
    CLOUDFRONT_DISTRIBUTION_ID=$(just env={{ env }} get-output CloudFrontDistributionId)
    npm install
    ENV={{ env }} npm run build
    aws s3 sync build/ s3://$S3_BUCKET_NAME --follow-symlinks --delete
    aws --no-cli-pager cloudfront create-invalidation \
      --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
      --paths "/*"

delete-stack:
    #!/usr/bin/env bash
    S3_BUCKET_NAME=$(just env={{ env }} get-output S3BucketName)
    aws s3 rm s3://$S3_BUCKET_NAME --recursive
    aws cloudformation delete-stack --stack-name {{ app_name }}-{{ env }}
    aws cloudformation wait stack-delete-complete --stack-name {{ app_name }}-{{ env }}

list-outputs:
    aws cloudformation describe-stacks \
        --stack-name {{ app_name }}-{{ env }} \
        --query 'Stacks[0].Outputs' \
        --output table

get-output key:
    aws cloudformation describe-stacks \
        --stack-name {{ app_name }}-{{ env }} \
        --query "Stacks[0].Outputs[?OutputKey=='{{ key }}'].OutputValue" \
        --output text