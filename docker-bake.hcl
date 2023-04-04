group "default" {
  targets = ["egodb"]
}

variable "IMAGE_REGISTRY" {
  default = "docker.io"
}

variable "IMAGE_TAG" {
  default = "latest"
}

target "egodb" {
	context = "."
  dockerfile = "docker/Dockerfile"
  tags = ["${IMAGE_REGISTRY}/egodb:latest", "${IMAGE_REGISTRY}/egodb:${IMAGE_TAG}"]
}
