"use client";

import { FormEvent, useState } from "react";

type FormStatus = {
  type: "idle" | "sending" | "success" | "error";
  message: string;
};

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Please enter your name.";
    if (!email) nextErrors.email = "Please enter your email so we can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Please enter a valid email address.";
    if (!message) nextErrors.message = "Please enter a message.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields.",
      });
      return;
    }

    setStatus({ type: "sending", message: "Sending your message…" });
    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/lilamen2026@gmail.com",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        },
      );
      const result = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;
      if (
        !response.ok ||
        result?.success === false ||
        result?.success === "false"
      ) {
        throw new Error(
          result?.message ||
            "The message service could not accept your message.",
        );
      }
      form.reset();
      setErrors({});
      setStatus({
        type: "success",
        message: "Thank you. Your message has been sent to LILAMEN.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your message could not be sent. Please email us directly instead.",
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <input
        type="hidden"
        name="_subject"
        value="New message from liliamen.com"
      />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <div className="field">
        <label htmlFor="contact-name">
          Customer name <span>Required</span>
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p className="field-error" id="name-error">
            {errors.name}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-email">
          Customer email <span>Required</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : "email-help"}
        />
        <p className="field-help" id="email-help">
          Enter your own email address so we know who sent the message and can
          reply.
        </p>
        {errors.email && (
          <p className="field-error" id="email-error">
            {errors.email}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-message">
          Message <span>Required</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <button
        className="button"
        type="submit"
        disabled={status.type === "sending"}
      >
        {status.type === "sending" ? "Sending…" : "Send message"}
      </button>
      {status.message && (
        <p className={`form-status ${status.type}`} role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}
