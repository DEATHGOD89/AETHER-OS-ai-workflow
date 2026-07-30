import { Controller, Post, Body, Param, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { GenerationService } from "./generation.service";
import { ImageGenerationRequestSchema } from "@aether/shared";

@Controller("api/v1/projects/:projectId/generation")
export class GenerationController {
  constructor(private readonly genService: GenerationService) {}

  @Post("image")
  async generateImage(
    @Param("projectId") projectId: string,
    @Body() body: any,
    @Res() res: Response
  ) {
    const parseResult = ImageGenerationRequestSchema.safeParse({ ...body, projectId });
    if (!parseResult.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: parseResult.error.format() });
    }

    const job = await this.genService.submitImageGeneration(parseResult.data);
    return res.status(HttpStatus.ACCEPTED).json(job);
  }
}
