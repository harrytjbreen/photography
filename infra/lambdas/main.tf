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

# Allow Lambda functions to read from DynamoDB tables
resource "aws_iam_policy" "api_lambda_dynamodb_policy" {
  name        = "api_lambda_dynamodb_policy"
  description = "Allow Lambda functions to read from DynamoDB tables"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:GetItem"
          "dynamodb:Query"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_dynamodb_policy_attachment" {
  policy_arn = aws_iam_policy.api_lambda_dynamodb_policy.arn
  role       = aws_iam_role.api_lambda_role.name
}

resource "aws_iam_role_policy_attachment" "api_lambda_basic_execution_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.api_lambda_role.name
}

resource "aws_lambda_function" "lambda" {
  for_each         = var.lambdas
  filename         = "${path.module}/files/${each.key}.zip"
  function_name    = each.key
  role             = aws_iam_role.api_lambda_role.arn
  handler          = var.lambda_defaults.handler
  source_code_hash = filebase64sha256("${path.module}/files/${each.key}.zip")
  runtime          = var.lambda_defaults.runtime
  environment {
    variables = lookup(each.value, "environment_variables", {})
  }
}
