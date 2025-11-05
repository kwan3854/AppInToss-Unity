/**
 * AIT Services Registry
 * - Central export point for all AIT SDK bridge services
 * - Add new services here as they are implemented
 */

export * from "./types";
export { openURLService } from "./openURL";

// Import all services
import { openURLService } from "./openURL";
import type { AitService } from "./types";

/**
 * All registered AIT services
 * - Add new services to this array to automatically register them in the bridge
 */
export const aitServices: AitService[] = [
  openURLService,
  // Add more services here as you implement them:
  // paymentService,
  // shareService,
  // biometricService,
  // etc.
];

