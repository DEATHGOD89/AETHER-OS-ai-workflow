import { ModelRegistry } from "../models/model-registry";

export interface UsageRecord {
  id: string;
  userId: string;
  projectId: string;
  modelId: string;
  promptTokens: number;
  completionTokens: number;
  totalCostUSD: number;
  latencyMs: number;
  timestamp: string;
}

export class CostTracker {
  private static instance: CostTracker;
  private records: UsageRecord[] = [];

  public static getInstance(): CostTracker {
    if (!CostTracker.instance) {
      CostTracker.instance = new CostTracker();
    }
    return CostTracker.instance;
  }

  public recordUsage(params: {
    userId: string;
    projectId: string;
    modelId: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
  }): UsageRecord {
    const model = ModelRegistry.getInstance().getModel(params.modelId);
    let cost = 0;

    if (model && !model.isLocal) {
      const inputCost = (params.promptTokens / 1000) * model.inputCostPer1K;
      const outputCost = (params.completionTokens / 1000) * model.outputCostPer1K;
      cost = Number((inputCost + outputCost).toFixed(6));
    }

    const record: UsageRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: params.userId,
      projectId: params.projectId,
      modelId: params.modelId,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
      totalCostUSD: cost,
      latencyMs: params.latencyMs,
      timestamp: new Date().toISOString(),
    };

    this.records.push(record);
    console.log(`[CostTracker] Recorded ${params.modelId} usage: $${cost} USD (${params.promptTokens + params.completionTokens} tokens)`);
    return record;
  }

  public getProjectTotalCost(projectId: string): number {
    return this.records
      .filter((r) => r.projectId === projectId)
      .reduce((sum, r) => sum + r.totalCostUSD, 0);
  }
}
