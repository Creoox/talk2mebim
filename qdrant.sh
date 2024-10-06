#!/bin/bash
docker pull qdrant/qdrant
docker run -d -p 6333:6333 qdrant/qdrant
