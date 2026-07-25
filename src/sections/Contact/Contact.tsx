import { useId, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiEnvelopeSimple,
  PiPhone,
  PiMapPin,
  PiGithubLogo,
  PiLinkedinLogo,
  PiXLogo,
  PiPaperPlaneTilt,
  PiCheckCircle,
  PiWarningCircle,
} from 'react-icons/pi';
import { SectionWrapper } from '@/components/layout';
import { SectionHeading, Button, IconButton } from '@/components/ui';
import { socialLinks } from '@/constants/socialLinks';
import { siteConfig } from '@/config/site.config';
import { contactCopy } from '@/content/contactCopy';
import { fadeInUp } from '@/animations/variants';
import { sendContactMessage } from '@/services/contactService';

const SOCIAL_ICON_MAP = {
  github: PiGithubLogo,
  linkedin: PiLinkedinLogo,
  x: PiXLogo,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Real submission via EmailJS (services/contactService.ts) — replaces
 * the earlier mailto: handoff now that a genuine send-to-inbox path is
 * implemented. Requires VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID /
 * _PUBLIC_KEY to be set (see .env.example) — an EmailJS account is
 * something only Arpan can create; nothing here can do that step.
 *
 * Validation happens on submit (not on every keystroke) so an in-progress
 * typo doesn't flash an error before the visitor has finished the field —
 * errors clear as soon as the field becomes valid on a later attempt.
 */
export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const emailLink = socialLinks.find((link) => link.platform === 'email');
  const iconSocials = socialLinks.filter(
    (link): link is typeof link & { platform: keyof typeof SOCIAL_ICON_MAP } => link.platform in SOCIAL_ICON_MAP
  );

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!email.trim()) errors.email = 'Please enter your email.';
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Please enter a valid email address.';
    if (!message.trim()) errors.message = 'Please enter a message.';
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('loading');
    setSubmitError('');
    try {
      await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <SectionWrapper id="contact">
      <SectionHeading id="contact-heading" eyebrow="Contact" title={contactCopy.heading} description={contactCopy.body} />

      <div className="mt-12 grid grid-cols-1 gap-10 desktop:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="flex flex-col gap-6"
        >
          <ul className="flex flex-col gap-4">
            {emailLink?.href && (
              <li className="flex items-center gap-3 text-body text-text-secondary">
                <PiEnvelopeSimple size={20} className="shrink-0 text-accent" aria-hidden="true" />
                <a href={emailLink.href} className="hover:text-text-primary">
                  {emailLink.href.replace('mailto:', '')}
                </a>
              </li>
            )}
            {siteConfig.phone && (
              <li className="flex items-center gap-3 text-body text-text-secondary">
                <PiPhone size={20} className="shrink-0 text-accent" aria-hidden="true" />
                <a href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`} className="hover:text-text-primary">
                  {siteConfig.phone}
                </a>
              </li>
            )}
            <li className="flex items-center gap-3 text-body text-text-secondary">
              <PiMapPin size={20} className="shrink-0 text-accent" aria-hidden="true" />
              <span>
                {siteConfig.location.city}, {siteConfig.location.region}, {siteConfig.location.country}
              </span>
            </li>
          </ul>

          {iconSocials.length > 0 && (
            <div className="flex items-center gap-2">
              {iconSocials.map((link) => {
                const Icon = SOCIAL_ICON_MAP[link.platform];
                return (
                  <motion.div key={link.platform} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                    <IconButton
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      icon={<Icon size={18} />}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
          aria-labelledby="contact-heading"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor={nameId} className="text-body-sm text-text-secondary">
              Name
            </label>
            <input
              id={nameId}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
              className="rounded-md border border-border bg-surface px-4 py-3 text-body text-text-primary outline-none transition-colors duration-fast ease-standard placeholder:text-text-tertiary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            />
            {fieldErrors.name && (
              <p id={`${nameId}-error`} className="text-body-sm text-danger">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={emailId} className="text-body-sm text-text-secondary">
              Your email
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
              className="rounded-md border border-border bg-surface px-4 py-3 text-body text-text-primary outline-none transition-colors duration-fast ease-standard placeholder:text-text-tertiary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            />
            {fieldErrors.email && (
              <p id={`${emailId}-error`} className="text-body-sm text-danger">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={messageId} className="text-body-sm text-text-secondary">
              Message
            </label>
            <textarea
              id={messageId}
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? `${messageId}-error` : undefined}
              className="resize-y rounded-md border border-border bg-surface px-4 py-3 text-body text-text-primary outline-none transition-colors duration-fast ease-standard placeholder:text-text-tertiary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            />
            {fieldErrors.message && (
              <p id={`${messageId}-error`} className="text-body-sm text-danger">
                {fieldErrors.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" loading={status === 'loading'} leftIcon={<PiPaperPlaneTilt size={16} />}>
              Send Message
            </Button>
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-body-sm text-accent"
                  role="status"
                >
                  <PiCheckCircle size={16} aria-hidden="true" />
                  Message sent — thanks for reaching out!
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-body-sm text-danger"
                  role="alert"
                >
                  <PiWarningCircle size={16} aria-hidden="true" />
                  {submitError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </SectionWrapper>
  );
}
