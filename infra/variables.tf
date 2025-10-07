variable "aws_account_id" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_repo" {
  type = string
}

locals {
  lambda_routes = jsondecode(file(var.routes_file))
}

variable "routes_file" {
  description = "Path to the generated routes file"
  type        = string
  default     = "infra/generated_routes.json"
}