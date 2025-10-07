locals {
  # Shared defaults for all Lambda functions
  lambda_defaults = {
    handler = "index.handler"
    runtime = "nodejs22.x"
  }

  lambdas = {
    publicAPI = {
      source_dir = "${path.module}/../lambdas/api/publicAPI"
    }
  }

  lambda_routes = jsondecode(file(var.routes_file))
}
