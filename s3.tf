terraform {
  backend "s3" {
    bucket       = "ual-terraform-state"
    key          = "ualibraries-libapps"
    use_lockfile = true
    region       = "us-west-2"
  }
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "public_bucket" {
  bucket = "ualibraries-libapps-sandbox"
}

resource "aws_s3_bucket_public_access_block" "public_bucket" {
  bucket = aws_s3_bucket.public_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_bucket" {
  bucket = aws_s3_bucket.public_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.public_bucket.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.public_bucket]
}

data "aws_iam_policy_document" "circleci_s3_policy_document" {
  statement {
    sid = "ListForTargetBucket"

    actions = [
      "s3:ListBucket"
    ]

    resources = [
      aws_s3_bucket.public_bucket.arn
    ]
  }

  statement {
    sid = "ObjectOperationsForTargetBucket"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    resources = [
      "${aws_s3_bucket.public_bucket.arn}/*"
    ]
  }
}

resource "aws_iam_user" "circleci" {
  name = "ualibraries-libapps-circleci"
}

resource "aws_iam_policy" "circleci_s3_policy" {
  name        = "ualibraries-libapps-circleci-policy"
  description = "Allow CircleCI deployment access to the ualibraries libapps S3 bucket"
  policy      = data.aws_iam_policy_document.circleci_s3_policy_document.json
}

resource "aws_iam_user_policy_attachment" "circleci_s3_policy_attachment" {
  user       = aws_iam_user.circleci.name
  policy_arn = aws_iam_policy.circleci_s3_policy.arn
}
