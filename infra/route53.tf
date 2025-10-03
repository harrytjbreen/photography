data "aws_route53_zone" "photos_zone" {
  name = "harrybreen.co.uk"
}

resource "aws_route53_record" "photos" {
  zone_id = data.aws_route53_zone.photos_zone.zone_id
  name    = "photos.harrybreen.co.uk"
  type    = "A"

  alias {
    name                   = aws_s3_bucket_website_configuration.frontend_bucket_website.website_domain
    zone_id                = aws_s3_bucket.frontend_bucket.hosted_zone_id
    evaluate_target_health = false
  }
}

