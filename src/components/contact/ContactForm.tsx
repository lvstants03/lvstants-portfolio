"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import homeData from "@/data/home.json";
import {
  CONTACT_LIMITS,
  CONTACT_SUBJECTS,
  ContactErrors,
  ContactPayload,
  normalizeContactPayload,
  validateContact,
} from "@/lib/contactValidation";

type Status = "idle" | "sending" | "success" | "error";
type ErrorCode = "generic" | "rate_limit" | "not_configured";

const INITIAL: ContactPayload = { name: "", email: "", subject: "", message: "", website: "" };

const inputBase =
  "w-full px-4 py-2.5 rounded-xl bg-zinc-950/70 border text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:ring-2";
const inputOk = "border-zinc-800 hover:border-zinc-700 focus:border-yellow-500/60 focus:ring-yellow-500/15";
const inputErr = "border-red-500/60 focus:border-red-500 focus:ring-red-500/15";

export default function ContactForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState<ContactPayload>(INITIAL);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<ErrorCode>("generic");

  const f = "contact.form";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Validate lai realtime cho truong da cham vao
    if (touched[name]) {
      setErrors(validateContact(normalizeContactPayload(next)));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setErrors(validateContact(normalizeContactPayload(values)));
  };

  const buildMailto = () => {
    const subjectLabel = values.subject ? t(`${f}.subjects.${values.subject}`) : "Portfolio";
    const subject = encodeURIComponent(`[Portfolio] ${subjectLabel} - ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n${values.name} <${values.email}>`);
    return `mailto:${homeData.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = normalizeContactPayload(values);
    const validation = validateContact(payload);
    setErrors(validation);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(validation).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        setStatus("success");
        setValues(INITIAL);
        setTouched({});
        setErrors({});
        return;
      }

      if (res.status === 422 && json.errors) {
        setErrors(json.errors as ContactErrors);
        setStatus("idle");
        return;
      }

      setErrorCode(res.status === 429 ? "rate_limit" : res.status === 503 ? "not_configured" : "generic");
      setStatus("error");
    } catch {
      setErrorCode("generic");
      setStatus("error");
    }
  };

  const fieldError = (name: keyof ContactErrors) =>
    touched[name] && errors[name] ? t(`${f}.errors.${errors[name]}`) : null;

  const renderError = (name: keyof ContactErrors) => {
    const msg = fieldError(name);
    return msg ? (
      <p id={`${name}-error`} className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {msg}
      </p>
    ) : null;
  };

  return (
    <div className="relative p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 shadow-xl backdrop-blur-md overflow-hidden">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex flex-col items-center justify-center text-center py-12 space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{t(`${f}.success_title`)}</h3>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">{t(`${f}.success_desc`)}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs transition-colors cursor-pointer"
            >
              {t(`${f}.send_another`)}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">{t(`${f}.heading`)}</h2>
              <p className="text-xs text-zinc-500">{t(`${f}.subheading`)}</p>
            </div>

            {/* Honeypot - an voi nguoi dung that */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {t(`${f}.name`)}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.nameMax}
                  placeholder={t(`${f}.name_placeholder`)}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!fieldError("name")}
                  aria-describedby={fieldError("name") ? "name-error" : undefined}
                  className={`${inputBase} ${fieldError("name") ? inputErr : inputOk}`}
                />
                {renderError("name")}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {t(`${f}.email`)}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder={t(`${f}.email_placeholder`)}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!fieldError("email")}
                  aria-describedby={fieldError("email") ? "email-error" : undefined}
                  className={`${inputBase} ${fieldError("email") ? inputErr : inputOk}`}
                />
                {renderError("email")}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {t(`${f}.subject`)}
              </label>
              <select
                id="subject"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!fieldError("subject")}
                aria-describedby={fieldError("subject") ? "subject-error" : undefined}
                className={`${inputBase} ${fieldError("subject") ? inputErr : inputOk} cursor-pointer ${
                  values.subject ? "" : "text-zinc-600"
                }`}
              >
                <option value="" disabled>
                  {t(`${f}.subject_placeholder`)}
                </option>
                {CONTACT_SUBJECTS.map((s) => (
                  <option key={s} value={s} className="bg-zinc-950 text-zinc-100">
                    {t(`${f}.subjects.${s}`)}
                  </option>
                ))}
              </select>
              {renderError("subject")}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="message" className="block text-xs font-semibold text-zinc-300">
                  {t(`${f}.message`)}
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    values.message.length > CONTACT_LIMITS.messageMax ? "text-red-400" : "text-zinc-600"
                  }`}
                >
                  {values.message.length}/{CONTACT_LIMITS.messageMax}
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={CONTACT_LIMITS.messageMax}
                placeholder={t(`${f}.message_placeholder`)}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!fieldError("message")}
                aria-describedby={fieldError("message") ? "message-error" : undefined}
                className={`${inputBase} ${fieldError("message") ? inputErr : inputOk} resize-y min-h-[140px]`}
              />
              {renderError("message")}
            </div>

            {status === "error" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {t(
                    errorCode === "rate_limit"
                      ? `${f}.error_rate_limit`
                      : errorCode === "not_configured"
                      ? `${f}.error_not_configured`
                      : `${f}.error_generic`
                  )}
                </span>
                {errorCode !== "rate_limit" && (
                  <a
                    href={buildMailto()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 whitespace-nowrap transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {t(`${f}.fallback_mailto`)}
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {t(`${f}.privacy_note`)}{" "}
                <Link href="/privacy-policy" className="text-yellow-400 hover:underline">
                  {t(`${f}.privacy_link`)}
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-yellow-500/10 cursor-pointer whitespace-nowrap"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t(`${f}.sending`)}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t(`${f}.submit`)}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
