import { generateHapticFeedback } from "@apps-in-toss/web-framework";
import type { HapticFeedbackType } from "@apps-in-toss/web-bridge";
import { InteractionServiceBase } from "../../generated/InteractionService/ait_interaction_InteractionServiceBase";
import type {
  GenerateHapticFeedbackRequest,
  GenerateHapticFeedbackResponse,
} from "../../generated/InteractionService/InteractionService";

const HAPTIC_FEEDBACK_TYPES: readonly HapticFeedbackType[] = [
  "tickWeak",
  "tap",
  "tickMedium",
  "softMedium",
  "basicWeak",
  "basicMedium",
  "success",
  "error",
  "wiggle",
  "confetti",
] as const;

const isValidHapticType = (value: string): value is HapticFeedbackType =>
  (HAPTIC_FEEDBACK_TYPES as readonly string[]).includes(value);

export class InteractionServiceImpl extends InteractionServiceBase {
  async GenerateHapticFeedback(
    request: GenerateHapticFeedbackRequest
  ): Promise<GenerateHapticFeedbackResponse> {
    const type = request.type;
    console.log(`[InteractionService] GenerateHapticFeedback: type=${type ?? ""}`);

    if (!type || !isValidHapticType(type)) {
      const error = new Error(
        `Haptic feedback type is required and must be one of ${HAPTIC_FEEDBACK_TYPES.join(", ")}`
      );
      console.error(`[InteractionService] ${error.message}`);
      throw error;
    }

    try {
      await generateHapticFeedback({ type });
      return { dummy: true };
    } catch (error) {
      console.error(
        `[InteractionService] Failed to generate haptic feedback:`,
        error
      );
      throw error;
    }
  }
}
