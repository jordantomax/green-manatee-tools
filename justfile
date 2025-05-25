ENV := "staging"
HOSTED_ZONE_ID := "Z02535232655GYP1E8JFP"
CERTIFICATE_ARN := "arn:aws:acm:us-east-1:300119504737:certificate/8fbd30aa-24a6-46d7-9b7b-0a309faf8ca3" 

# Help
default:
    just --list

infra:
    sam deploy \
        --template-file infra/app.yaml \
        --stack-name tools-frontend-{{ ENV }} \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameter-overrides \
            Env={{ ENV }} \
            HostedZoneId={{ HOSTED_ZONE_ID }} \
            CertificateArn={{ CERTIFICATE_ARN }}

deploy:
    #!/usr/bin/env bash
    s3_bucket_name=$(just get-output S3BucketName)
    cloudfront_distribution_id=$(just get-output CloudFrontDistributionId)
    npm install
    ENV={{ ENV }} npm run build
    aws s3 sync build/ s3://$s3_bucket_name --follow-symlinks --delete
    aws --no-cli-pager cloudfront create-invalidation \
      --distribution-id "$cloudfront_distribution_id" \
      --paths "/*"

delete-stack:
    aws s3 rm s3://tools-frontend-{{ ENV }} --recursive
    aws cloudformation delete-stack --stack-name tools-frontend-{{ ENV }}
    aws cloudformation wait stack-delete-complete --stack-name tools-frontend-{{ ENV }}

list-outputs:
    aws cloudformation describe-stacks \
        --stack-name tools-frontend-{{ ENV }} \
        --query 'Stacks[0].Outputs' \
        --output table

get-output KEY:
    aws cloudformation describe-stacks \
        --stack-name tools-frontend-{{ ENV }} \
        --query "Stacks[0].Outputs[?OutputKey=='{{ KEY }}'].OutputValue" \
        --output text