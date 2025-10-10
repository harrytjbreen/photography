# Bulk Upload Photos Script

## Overview

This script automates the bulk upload of photos to AWS S3 and indexes metadata in AWS DynamoDB. It is designed to efficiently add large numbers of photos, organizing them into collections within your DynamoDB table while storing the actual image files in S3 buckets. The script supports specifying both a collection identifier (`collectionId`) used as a slug and a human-readable collection name (`collectionName`) for display purposes.

## Prerequisites

Before using this script, ensure you have the following:

- **Node.js**: The script runs on Node.js. You can download it from [nodejs.org](https://nodejs.org/).
- **AWS Credentials**: You must have AWS credentials configured with permissions to access S3 and DynamoDB. These can be set up via the AWS CLI or environment variables.
- **DynamoDB Table and S3 Bucket**: You need an existing DynamoDB setup with a single table for collections and photos, as well as an S3 bucket where photos will be stored.

## Installation

1. Clone or download this repository.
2. Navigate to the `scripts/bulkAddPhotos` directory in your terminal.
3. Run the following command to install dependencies:

   ```
   npm install
   ```

## Configuration

This script is written in TypeScript. Configure your AWS credentials and region using one of the following methods:

- Export environment variables:

  ```
  export AWS_ACCESS_KEY_ID=your_access_key
  export AWS_SECRET_ACCESS_KEY=your_secret_key
  export AWS_REGION=your_region
  ```

- Or configure the AWS CLI and ensure the default profile is set up.

Update any script-specific configuration such as DynamoDB table name or S3 bucket name in the script or a configuration file, if applicable.

## Running the Script

Before running the script, compile the TypeScript source (`index.ts`) to JavaScript. This is handled automatically using the provided npm run script.

To run the bulk upload script, use the following command:

```
npm run run -- --input "folder" --collectionId "collection-slug" --collectionName "Collection Display Name" --previewFileName "cover.jpg"
```

- `--input`: Path to the directory containing photos to upload.
- `--collectionId`: A slug or unique identifier for the collection (used for organizing files and indexing).
- `--collectionName`: The human-readable name of the collection for display purposes.
- `--previewFileName` (optional): Specify the filename of the photo to use as the collection’s preview image. If this option is not provided, the script will choose the preview image automatically or prompt for selection.

Example including `--previewFileName`:

```
npm run run -- --input "folder" --collectionId "collection-slug" --collectionName "Collection Display Name" --previewFileName "cover.jpg"
```

If the provided filename does not match any uploaded photo, the script will skip updating the preview image and log a warning.

Both `--collectionId` and `--collectionName` are required to properly categorize and label the uploaded photos within your DynamoDB table and S3 bucket.

Additional command line options may be available depending on the script implementation.

## Data Model

- **Collections**: Represented by a unique `collectionId` (slug) and a `collectionName` (display name). Collections group individual photo entries and are stored in a single DynamoDB table alongside photos.
- **Photos**: Individual photo metadata entries stored in the same DynamoDB table, linked to their collection via the `collectionId`. The actual image files are stored in an S3 bucket, organized by the collection slug.

## Troubleshooting

- Ensure your AWS credentials have the necessary permissions for S3 and DynamoDB operations.
- Verify that your DynamoDB table and S3 bucket exist and are properly configured.
- If you encounter permission errors, double-check your IAM policies.
- For large uploads, consider AWS service limits and possible throttling.
- Review logs/output for error messages to help diagnose issues.

### S3 `NoSuchBucket` Error

If you encounter an error such as `NoSuchBucket: The specified bucket does not exist`, this means the S3 bucket specified in your script either does not exist in your AWS account or is misconfigured.

- **Check that the bucket name in your script or configuration matches the actual bucket name in AWS S3.** Bucket names are case-sensitive and must match exactly.
- **Ensure the bucket exists in the AWS region you are using.** Buckets are region-specific.
- **Verify your AWS credentials have permission to access the target bucket.** You may need to check your IAM policies or roles.
- **If you are setting the bucket name via environment variables or a configuration file, double-check those values.** Make sure the environment variable or config matches the bucket name in AWS.

For further assistance, consult the AWS SDK documentation or your project maintainer.