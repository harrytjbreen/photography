variable "aws_account_id" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "routes_file" {
  description = "Path to the generated routes file"
  type        = string
  default     = "generated_routes.json"
}