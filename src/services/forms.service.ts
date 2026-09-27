import { apiEndpoints } from "@/config/api-endpoints";
import { apiRequest } from "./api/client";
import type { AdvertiseEnquiryPayload, ContactPayload, FormSubmitResponse, Locale, MembershipPayload, NewsletterPayload } from "@/types/api";
import type { AdvertiseValues, ContactValues, MembershipValues } from "@/lib/validation/schemas";

// ---------- Payload builders ----------

export const buildContactPayload = (values: ContactValues, locale: Locale): ContactPayload => ({
  name: values.name,
  email: values.email.toLowerCase(),
  mobile: values.mobile,
  subject: values.subject,
  message: values.message,
  locale,
  attachment: values.attachment ?? null,
});

export const buildMembershipPayload = (values: MembershipValues, locale: Locale): MembershipPayload => ({
  name: values.name,
  email: values.email.toLowerCase(),
  mobile: { countryCode: "+91", number: values.mobile },
  address: { line: values.address, city: values.city, state: values.state, pincode: values.pincode },
  plan: values.plan,
  organization: values.organization || undefined,
  message: values.message || undefined,
  consentUpdates: values.consentUpdates,
  locale,
});

export const buildAdvertisePayload = (values: AdvertiseValues, locale: Locale): AdvertiseEnquiryPayload => ({
  name: values.name,
  organization: values.organization,
  email: values.email.toLowerCase(),
  mobile: { countryCode: "+91", number: values.mobile },
  adSlot: values.adSlot,
  issueMonth: values.issueMonth || undefined,
  message: values.message,
  locale,
});

/** The contact form can carry a file, so it is sent as multipart/form-data */
function toFormData(payload: ContactPayload) {
  const data = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    data.append(key, value instanceof File ? value : String(value));
  }
  return data;
}

// ---------- Calls ----------

export const formsService = {
  contact: (payload: ContactPayload) =>
    apiRequest<FormSubmitResponse>(apiEndpoints.forms.contact, { formData: toFormData(payload) }),
  membership: (payload: MembershipPayload) => apiRequest<FormSubmitResponse>(apiEndpoints.forms.membership, { body: payload }),
  advertise: (payload: AdvertiseEnquiryPayload) => apiRequest<FormSubmitResponse>(apiEndpoints.forms.advertise, { body: payload }),
  newsletter: (payload: NewsletterPayload) => apiRequest<FormSubmitResponse>(apiEndpoints.forms.newsletter, { body: payload }),
};
