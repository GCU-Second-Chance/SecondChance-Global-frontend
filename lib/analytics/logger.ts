/**
 * Analytics Logger
 * Type-safe event logging functions for Google Analytics
 */

import { event as gtagEvent } from "./gtag";
import type { AnalyticsEvent } from "./events";

/**
 * Log a typed analytics event
 * @param eventData - Event data object with event type and parameters
 */
export function logEvent<T extends AnalyticsEvent>(eventData: T): void {
  const { event: eventName, ...params } = eventData;
  gtagEvent(eventName, params);
}

/**
 * Log a page view event
 * @param path - Page path
 * @param title - Page title (optional)
 */
export function logPageView(path: string, title?: string): void {
  logEvent({
    event: "page_view",
    page_path: path,
    page_title: title,
  });
}

/**
 * Log when a dog is shared
 */
export function logDogShared(
  dogId: string,
  dogName: string,
  shareMethod?: "web_share" | "link_copy" | "direct"
): void {
  logEvent({
    event: "dog_shared",
    dog_id: dogId,
    dog_name: dogName,
    share_method: shareMethod,
  });
}

/**
 * Log when a share is completed
 */
export function logShareCompleted(dogId: string, dogName: string, platform?: string): void {
  logEvent({
    event: "share_completed",
    dog_id: dogId,
    dog_name: dogName,
    platform,
  });
}

/**
 * Log share platform selection
 */
export function logSharePlatform(platform: string, dogId: string): void {
  logEvent({
    event: "share_platform",
    platform,
    dog_id: dogId,
  });
}

/**
 * Log when a dog is matched in challenge
 */
export function logDogMatched(
  dogId: string,
  dogName: string,
  matchMethod: "random" | "direct"
): void {
  logEvent({
    event: "dog_matched",
    dog_id: dogId,
    dog_name: dogName,
    match_method: matchMethod,
  });
}

/**
 * Log challenge step progression
 */
export function logChallengeStep(
  step: 1 | 2 | 3 | 4,
  stepName: "frame" | "dog" | "photos" | "result"
): void {
  logEvent({
    event: "challenge_step",
    step,
    step_name: stepName,
  });
}

/**
 * Log challenge completion
 */
export function logChallengeCompleted(
  dogId: string,
  frameId: string,
  completionTimeSeconds: number
): void {
  logEvent({
    event: "challenge_completed",
    dog_id: dogId,
    frame_id: frameId,
    completion_time_seconds: completionTimeSeconds,
  });
}

/**
 * Log QR code scan
 */
export function logQRScanned(dogId: string, source?: "challenge_result" | "social_share"): void {
  logEvent({
    event: "qr_scanned",
    dog_id: dogId,
    source,
  });
}

/**
 * Log challenge conversion action
 */
export function logChallengeConversion(
  dogId: string,
  action: "view_details" | "share" | "adopt_inquiry"
): void {
  logEvent({
    event: "challenge_conversion",
    dog_id: dogId,
    action,
  });
}

/**
 * Log challenge to share conversion
 */
export function logChallengeToShare(dogId: string, initialChallengeId?: string): void {
  logEvent({
    event: "challenge_to_share",
    dog_id: dogId,
    initial_challenge_id: initialChallengeId,
  });
}

/**
 * Log frame selection
 */
export function logFrameSelected(frameId: string, frameTemplate: "2x2" | "4x1" | "1x4"): void {
  logEvent({
    event: "frame_selected",
    frame_id: frameId,
    frame_template: frameTemplate,
  });
}

/**
 * Log photo upload
 */
export function logPhotoUploaded(slotIndex: number, uploadMethod: "camera" | "file"): void {
  logEvent({
    event: "photo_uploaded",
    slot_index: slotIndex,
    upload_method: uploadMethod,
  });
}

/**
 * Log result download
 */
export function logResultDownloaded(dogId: string, frameId: string): void {
  logEvent({
    event: "result_downloaded",
    dog_id: dogId,
    frame_id: frameId,
  });
}

/**
 * Log language change
 */
export function logLanguageChanged(fromLanguage: string, toLanguage: string): void {
  logEvent({
    event: "language_changed",
    from_language: fromLanguage,
    to_language: toLanguage,
  });
}

/**
 * Log error
 */
export function logError(errorMessage: string, errorContext?: string, pagePath?: string): void {
  logEvent({
    event: "error",
    error_message: errorMessage,
    error_context: errorContext,
    page_path: pagePath,
  });
}
