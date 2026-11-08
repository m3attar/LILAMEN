"use client";

import { FormEvent, useEffect, useState } from "react";

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

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

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("sent") === "1") {
      setStatus({
        type: "success",
        message:
          "Thank you. Your message has been accepted and sent to LILIAMEN.",
      });
      url.searchParams.delete("sent");
      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
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
      event.preventDefault();
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields.",
      });
      return;
    }

    if (!accessKey) {
      event.preventDefault();
      setStatus({
        type: "error",
        message:
          "Online messages are temporarily unavailable. Please email Liliamen.Support@gmail.com directly.",
      });
      return;
    }
    setStatus({ type: "sending", message: "Sending your message…" });
  }

  return (
    <form
      className="contact-form"
      action="https://api.web3forms.com/submit"
      method="POST"
      onSubmit={submit}
      noValidate
    >
      <input type="hidden" name="access_key" value={accessKey} />
      <input
        type="hidden"
        name="subject"
        value="New message from liliamen.com"
      />
      <input type="hidden" name="from_name" value="LILIAMEN website" />
      <input
        type="hidden"
        name="redirect"
        value="https://liliamen.com/contact/?sent=1"
      />
      <input
        type="checkbox"
        name="botcheck"
        className="form-botcheck"
        tabIndex={-1}
        autoComplete="off"
      />
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
