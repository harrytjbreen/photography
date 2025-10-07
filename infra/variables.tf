variable "aws_account_id" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "api_configs" {
  description = "API Gateways and their routes"
  type = map(object({
    lambda_name = string
    routes      = list(string)
  }))
}