/**
 * Analytics Event Types
 * Defines all custom events for SecondChance Global
 */

/**
 * Dog sharing events
 */
export interface DogSharedEvent {
  event: "dog_shared";
  dog_id: string;
  dog_name: string;
  share_method?: "web_share" | "link_copy" | "direct";
}

export interface ShareCompletedEvent {
  event: "share_completed";
  dog_id: string;
  dog_name: string;
  platform?: string; // e.g., "instagram", "facebook", "twitter"
}

export interface SharePlatformEvent {
  event: "share_platform";
  platform: string;
  dog_id: string;
}

/**
 * Challenge flow events
 */
export interface DogMatchedEvent {
  event: "dog_matched";
  dog_id: string;
  dog_name: string;
  match_method: "random" | "direct";
}

export interface ChallengeStepEvent {
  event: "challenge_step";
  step: 1 | 2 | 3 | 4;
  step_name: "frame" | "dog" | "photos" | "result";
}

export interface ChallengeCompletedEvent {
  event: "challenge_completed";
  dog_id: string;
  frame_id: string;
  completion_time_seconds: number;
}

/**
 * QR code and conversion events
 */
export interface QRScannedEvent {
  event: "qr_scanned";
  dog_id: string;
  source?: "challenge_result" | "social_share";
}

export interface ChallengeConversionEvent {
  event: "challenge_conversion";
  dog_id: string;
  action: "view_details" | "share" | "adopt_inquiry";
}

export interface ChallengeToShareEvent {
  event: "challenge_to_share";
  dog_id: string;
  initial_challenge_id?: string;
}

/**
 * User interaction events
 */
export interface FrameSelectedEvent {
  event: "frame_selected";
  frame_id: string;
  frame_template: "2x2" | "4x1" | "1x4";
}

export interface PhotoUploadedEvent {
  event: "photo_uploaded";
  slot_index: number;
  upload_method: "camera" | "file";
}

export interface ResultDownloadedEvent {
  event: "result_downloaded";
  dog_id: string;
  frame_id: string;
}

/**
 * Navigation events
 */
export interface PageViewEvent {
  event: "page_view";
  page_path: string;
  page_title?: string;
}

export interface LanguageChangedEvent {
  event: "language_changed";
  from_language: string;
  to_language: string;
}

/**
 * Error events
 */
export interface ErrorEvent {
  event: "error";
  error_message: string;
  error_context?: string;
  page_path?: string;
}

/**
 * Union type of all events
 */
export type AnalyticsEvent =
  | DogSharedEvent
  | ShareCompletedEvent
  | SharePlatformEvent
  | DogMatchedEvent
  | ChallengeStepEvent
  | ChallengeCompletedEvent
  | QRScannedEvent
  | ChallengeConversionEvent
  | ChallengeToShareEvent
  | FrameSelectedEvent
  | PhotoUploadedEvent
  | ResultDownloadedEvent
  | PageViewEvent
  | LanguageChangedEvent
  | ErrorEvent;
