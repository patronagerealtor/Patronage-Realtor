/**
 * Webinar registration and payment proof. Components use this instead of calling Supabase/Cloudinary directly.
 */
import {
  insertWebinarRegistration,
  uploadWebinarPaymentProof,
  type WebinarRegistrationRow,
  type WebinarRegistrationResult,
  type UploadPaymentProofResult,
} from "@/lib/supabase";

export type { WebinarRegistrationRow, WebinarRegistrationResult, UploadPaymentProofResult };

export const webinarService = {
  insertWebinarRegistration,
  uploadWebinarPaymentProof,
};
