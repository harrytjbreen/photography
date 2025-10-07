output "lambda_arns" {
  description = "Map of Lambda function ARNs by name"
  value       = { for k, v in aws_lambda_function.lambda : k => v.arn }
}

output "lambda_invoke_arns" {
  description = "Map of Lambda invoke ARNs by name"
  value       = { for k, v in aws_lambda_function.lambda : k => v.invoke_arn }
}

output "lambda_names" {
  description = "Map of Lambda function names by name"
  value       = { for k, v in aws_lambda_function.lambda : k => v.function_name }
}