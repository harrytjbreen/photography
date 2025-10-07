data "aws_route53_zone" "photos_zone" {
  name = "harrybreen.co.uk"
}

resource "aws_route53_record" "photos" {
  zone_id = data.aws_route53_zone.photos_zone.zone_id
  name    = "photos.harrybreen.co.uk"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "photos_api" {
  zone_id = aws_route53_zone.harrybreen.zone_id
  name    = "api.photos.harrybreen.co.uk"
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.photos_api_domain.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.photos_api_domain.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
