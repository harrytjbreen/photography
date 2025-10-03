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

