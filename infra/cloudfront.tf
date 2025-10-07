resource "aws_cloudfront_origin_access_control" "frontend_oac" {
  name                              = "photos-frontend-oac"
  description                       = "OAC for CloudFront to access S3 frontend bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  comment             = "Photos frontend distribution"
  default_root_object = "index.html"
  aliases             = ["photos.harrybreen.co.uk"]
  depends_on          = [aws_acm_certificate_validation.frontend]

  origin {
    domain_name              = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id                = "s3-photos-frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-photos-frontend"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.frontend.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  tags = {
    Name = "photos-frontend-cf"
  }
}

resource "aws_cloudfront_distribution" "api" {
  enabled    = true
  comment    = "Photos API distribution"
  aliases    = ["api.photos.harrybreen.co.uk"]
  depends_on = [aws_acm_certificate_validation.frontend]

  origin {
    domain_name = aws_apigatewayv2_domain_name.photos_api_domain.domain_name_configuration[0].target_domain_name
    origin_id   = "api-gateway-origin"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "POST", "PUT", "OPTIONS"]
    cached_methods         = ["GET", "OPTIONS"]
    target_origin_id       = "api-gateway-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    forwarded_values {
      query_string = true
      headers      = ["Authorization"]
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.api.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "photos-api-cf"
  }
}