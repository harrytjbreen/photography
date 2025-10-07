resource "aws_apigatewayv2_api" "main_api" {
  name          = "photos-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["content-type", "authorization"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each               = local.lambda_routes
  api_id                 = aws_apigatewayv2_api.main_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = module.lambdas.lambda_invoke_arns[each.value.lambda_name]
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "routes" {
  for_each = {
    for pair in flatten([
      for api_name, config in local.lambda_routes : [
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

resource "aws_lambda_permission" "apigw_invoke" {
  for_each      = local.lambda_routes
  statement_id  = "AllowExecutionFromAPIGateway-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = module.lambdas.lambda_names[each.value.lambda_name]
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_domain_name" "photos_api_domain" {
  domain_name = "api.photos.harrybreen.co.uk"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.main_api.api_endpoint
}
