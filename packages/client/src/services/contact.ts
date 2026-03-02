/**
 * Contact leads service (property inquiries, floor plan requests).
 * Components use this instead of calling Supabase directly.
 */
import {
  insertContactLead,
  type ContactLeadInsert,
  type InsertContactLeadResult,
} from "@/lib/supabase";

export type { ContactLeadInsert, InsertContactLeadResult };

export const contactService = {
  insertContactLead,
};
