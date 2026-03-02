/**
 * Newsletter subscription service. Components use this instead of calling Supabase directly.
 */
import { insertNewsletterSubscriber, type InsertNewsletterSubscriberResult } from "@/lib/supabase";

export type { InsertNewsletterSubscriberResult };

export const newsletterService = {
  insertNewsletterSubscriber,
};
