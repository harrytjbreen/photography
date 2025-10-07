resource "aws_apigatewayv2_api" "main_api" {
  name          = "photos-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["content-type", "authorization"]
  }
}

# Default deployment stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main_api.id
  name        = "$default"
  auto_deploy = true
}

# Create one integration per Lambda (so multiple Lambdas can be behind one API Gateway)
resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each               = var.api_configs
  api_id                 = aws_apigatewayv2_api.main_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = module.lambdas.lambda_invoke_arns[each.value.lambda_name]
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Create all routes for all APIs, each mapped to its Lambda integration
resource "aws_apigatewayv2_route" "routes" {
  for_each = {
    for pair in flatten([
      for api_name, config in var.api_configs : [
        for r in config.routes : {
          api_name  = api_name
          route_key = r
        }
      ]
    ]) : "${pair.api_name}-${replace(pair.route_key, " ", "_")}" => pair
  }

  api_id    = aws_apigatewayv2_api.main_api.id
  route_key = each.value.route_key
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.value.api_name].id}"
}

# Allow API Gateway to invoke all lambdas
resource "aws_lambda_permission" "apigw_invoke" {
  for_each      = var.api_configs
  statement_id  = "AllowExecutionFromAPIGateway-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = module.lambdas.lambda_names[each.value.lambda_name]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main_api.execution_arn}/*/*"
}

# Output shared API Gateway endpoint
output "api_gateway_url" {
  value = aws_apigatewayv2_api.main_api.api_endpoint
}