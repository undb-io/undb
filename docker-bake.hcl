group "default" {
  targets = ["backend", "web"]
}

variable "IMAGE_REGISTRY" {
  default = "docker.io"
}

variable "IMAGE_TAG" {
  default = "latest"
}

target "web" {
	context = "."
  dockerfile = "docker/web/Dockerfile"
  tags = ["${IMAGE_REGISTRY}/egodb/web:latest", "${IMAGE_REGISTRY}/egodb/web:${IMAGE_TAG}"]
}

target "backend" {
	context = "."
  dockerfile = "docker/backend/Dockerfile"
  tags = ["${IMAGE_REGISTRY}/egodb/backend:latest", "${IMAGE_REGISTRY}/egodb/backend:${IMAGE_TAG}"]
}