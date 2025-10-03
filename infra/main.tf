terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-west-1"
}

terraform {
  backend "s3" {
    bucket         = "photos-tf-state-123456789012-eu-west-1"
    key            = "infra/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "photos-tf-locks"
    encrypt        = true
  }
}

resource "aws_iam_role" "github_actions" {
  name = "github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.aws_account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_owner}/${var.github_repo}:ref:refs/heads/main",
              "repo:${var.github_owner}/${var.github_repo}:pull_request"
            ]
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions" {
  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}


module "lambdas" {
  source           = "./lambdas"
  lambdas          = local.lambdas
  lambda_defaults  = local.lambda_defaults
}