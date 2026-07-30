import { Injectable } from "@nestjs/common";
import { ImageGenerationRequest } from "@aether/shared";

@Injectable()
export class GenerationService {
  async submitImageGeneration(req: ImageGenerationRequest) {
    const jobId = `img_job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      jobId,
      status: "QUEUED",
      backend: req.backend,
      estimatedSeconds: 8,
      createdAt: new Date().toISOString(),
    };
  }
}
