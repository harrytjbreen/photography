resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "photos-frontend-${var.aws_account_id}"

  tags = {
    Name = "photos-frontend"
  }
}

resource "aws_s3_bucket_website_configuration" "frontend_bucket_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}