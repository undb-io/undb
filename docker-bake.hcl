group "default" {
  targets = ["undb"]
}

variable "IMAGE_REGISTRY" {
  default = "docker.io"
}

variable "IMAGE_TAG" {
  default = "latest"
}

target "undb" {
	context = "."
  dockerfile = "Dockerfile"
  tags = ["${IMAGE_REGISTRY}/undb:latest", "${IMAGE_REGISTRY}/undb:${IMAGE_TAG}"]
}
