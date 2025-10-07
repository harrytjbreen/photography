terraform {
  required_version = ">= 1.2.0"
}

# Lambda IAM role (generic API role)
resource "aws_iam_role" "api_lambda_role" {
  name = "api_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.api_lambda_role.name
}

# Package each lambda into a zip
data "archive_file" "lambda_zip" {
  for_each    = var.lambdas
  type        = "zip"
  source_dir  = each.value.source_dir
  output_path = "${path.module}/files/${each.key}.zip"
}

resource "aws_lambda_function" "lambda" {
  for_each         = var.lambdas
  filename         = data.archive_file.lambda_zip[each.key].output_path
  function_name    = each.key
  role             = aws_iam_role.api_lambda_role.arn
  handler          = var.lambda_defaults.handler
  source_code_hash = data.archive_file.lambda_zip[each.key].output_base64sha256
  runtime          = var.lambda_defaults.runtime
}
