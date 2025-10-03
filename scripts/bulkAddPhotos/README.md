# Bulk Upload Photos Script

## Overview

This script automates the bulk upload of photos to AWS S3 and indexes metadata in AWS DynamoDB. It is designed to help you efficiently add large numbers of photos, organizing them into rolls within your DynamoDB tables while storing the actual image files in S3 buckets.

## Prerequisites

Before using this script, ensure you have the following:

- **Node.js**: The script runs on Node.js. You can download it from [nodejs.org](https://nodejs.org/).
- **AWS Credentials**: You must have AWS credentials configured with permissions to access S3 and DynamoDB. These can be set up via the AWS CLI or environment variables.
- **DynamoDB Tables and S3 Bucket**: You need an existing DynamoDB setup with tables for rolls and photos, as well as an S3 bucket where photos will be stored.

## Installation

1. Clone or download this repository.
2. Navigate to the `scripts/bulkAddPhotos` directory in your terminal.
3. Run the following command to install dependencies:

   ```
   npm install
   ```

## Configuration

Configure your AWS credentials and region using one of the following methods:

- Export environment variables:

  ```
  export AWS_ACCESS_KEY_ID=your_access_key
  export AWS_SECRET_ACCESS_KEY=your_secret_key
  export AWS_REGION=your_region
  ```

- Or configure the AWS CLI and ensure the default profile is set up.

Update any script-specific configuration such as DynamoDB table names or S3 bucket names in the script or a configuration file, if applicable.

## Running the Script

Run the bulk upload script using Node.js. Example commands:

```
node index.js --input /path/to/photos --roll "Roll 1"
```

- `--input`: Path to the directory containing photos to upload.
- `--roll`: Name of the roll within the collection.

Additional command line options may be available depending on the script implementation.

## Data Model

- **Rolls**: Subsets representing individual photo shoots or batches. Stored in DynamoDB linked to photos.
- **Photos**: Individual photo metadata entries stored in DynamoDB, with references to their roll. The actual image files are stored in an S3 bucket, organized by roll.

## Notes / Troubleshooting

- Ensure your AWS credentials have the necessary permissions for S3 and DynamoDB operations.
- Verify that your DynamoDB tables and S3 bucket exist and are properly configured.
- If you encounter permission errors, double-check your IAM policies.
- For large uploads, consider AWS service limits and possible throttling.
- Review logs/output for error messages to help diagnose issues.

For further assistance, consult the AWS SDK documentation or your project maintainer.