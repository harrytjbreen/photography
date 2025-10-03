locals {
  # Shared defaults for all Lambda functions
  lambda_defaults = {
    handler = "index.handler"
    runtime = "nodejs22.x"
  }

  # Only per-function specifics go here
  lambdas = {
    photosHandler = {
      source_dir = "${path.module}/../lambdas/api/photosHandler"
    }
    rollsHandler = {
      source_dir = "${path.module}/../lambdas/api/rollsHandler"
    }
  }
}
