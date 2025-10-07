variable "lambdas" {
  description = "Map of Lambda functions to deploy, keyed by function name."
  type = map(object({
    source_dir            = string
    environment_variables = optional(map(string))
  }))
}

variable "lambda_defaults" {
  description = "Shared Lambda configuration defaults."
  type = object({
    handler = string
    runtime = string
  })
}
