import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import f from '../../css/HTML.module.css';
import styles from '../../css/SkillPage.module.css';

const MAX_MESSAGE = 1200;

const INITIAL_FORM = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'Praise Submission',
    attachment: null,
};

const ContactForm = () => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [captchaToken, setCaptchaToken] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | 'nocaptcha'
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, attachment: file || null }));
        setFileName(file ? file.name : '');
    };

    const msgLen = formData.message.length;
    const charClass =
        msgLen > MAX_MESSAGE ? f.charCountOver :
        msgLen > MAX_MESSAGE * 0.85 ? f.charCountWarn :
        f.charCount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            setSubmitStatus('nocaptcha');
            return;
        }
        setSubmitting(true);
        setSubmitStatus(null);

        try {
            // TODO: wire to real API endpoint when backend is ready
            console.log('Form submitted:', formData);
            await new Promise(r => setTimeout(r, 800)); // simulate network
            setFormData(INITIAL_FORM);
            setFileName('');
            setCaptchaToken('');
            setSubmitStatus('success');
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.skillPage}>

            {/* ── Hero ── */}
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>HTML</h1>
                <p className={styles.heroTagline}>
                    Semantic markup as the foundation of accessible, indexable web experiences
                </p>
                <div className={styles.heroBadges}>
                    {['HTML5', 'Semantic Elements', 'Accessibility', 'Forms', 'SEO', 'ARIA'].map(b => (
                        <span key={b} className={styles.heroBadge}>{b}</span>
                    ))}
                </div>
            </div>

            {/* ── How I Use HTML Daily ── */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>How I Use HTML Daily</h2>
                <p className={styles.sectionText}>
                    HTML is the structural foundation of every web project I build. I write semantic HTML5 — using proper
                    elements (<code>article</code>, <code>nav</code>, <code>section</code>, <code>main</code>, <code>aside</code>)
                    rather than div soup. This improves accessibility for screen readers, helps search engine indexing, and makes
                    CSS/JS targeting more maintainable. The contact form below demonstrates real semantic patterns:
                    proper <code>fieldset</code> grouping, <code>label</code>/<code>input</code> associations,
                    <code>required</code> attributes, and reCAPTCHA v2 for spam protection.
                </p>
            </div>

            {/* ── Tip ── */}
            <div className={styles.tipBox}>
                Use semantic HTML elements over generic divs whenever possible. Search engines and screen readers understand
                &lt;nav&gt;, &lt;article&gt;, and &lt;main&gt; — they carry meaning to crawlers and assistive technology
                that a plain &lt;div&gt; cannot convey.
            </div>

            {/* ── Contact Form ── */}
            <div className={f.contactForm}>
                <p className={f.formHeading}>Contact Me</p>
                <p className={f.formSubheading}>
                    Fill out the form below and I'll respond within 1–2 business days.
                </p>

                <form onSubmit={handleSubmit} noValidate>

                    {/* ── Contact details fieldset ── */}
                    <fieldset className={f.fieldset}>
                        <legend className={f.legend}>Contact Details</legend>

                        {/* Row: Name + Email */}
                        <div className={f.formRow}>
                            <div className={f.formGroup}>
                                <label htmlFor="name">
                                    Full Name <span className={f.required} aria-hidden="true">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Brandon Boyd"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div className={f.formGroup}>
                                <label htmlFor="email">
                                    Email Address <span className={f.required} aria-hidden="true">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Row: Phone + Inquiry Type */}
                        <div className={f.formRow}>
                            <div className={f.formGroup}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    autoComplete="tel"
                                />
                            </div>
                            <div className={f.formGroup}>
                                <label htmlFor="inquiryType">Inquiry Type</label>
                                <select
                                    id="inquiryType"
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleChange}
                                >
                                    <option value="Praise Submission">🏆 Praise Submission</option>
                                    <option value="Technical">⚙ Technical Question</option>
                                    <option value="Resume Inquiry">📄 Resume Inquiry</option>
                                    <option value="General Request">💬 General Request</option>
                                </select>
                            </div>
                        </div>

                        {/* Subject — full width */}
                        <div className={f.formGroup}>
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What's this about?"
                            />
                        </div>
                    </fieldset>

                    {/* ── Message fieldset ── */}
                    <fieldset className={f.fieldset}>
                        <legend className={f.legend}>Message</legend>

                        <div className={f.formGroup}>
                            <label htmlFor="message">
                                Message <span className={f.required} aria-hidden="true">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                required
                                maxLength={MAX_MESSAGE}
                                aria-describedby="msg-count"
                            />
                            <span id="msg-count" className={charClass}>
                                {msgLen} / {MAX_MESSAGE}
                            </span>
                        </div>

                        {/* File attachment */}
                        <div className={f.formGroup}>
                            <label htmlFor="attachment">
                                Attachment{' '}
                                <span style={{ color: '#555', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                                    (optional — pdf, doc, image)
                                </span>
                            </label>
                            <div className={f.fileWrapper}>
                                <span className={f.fileIcon}>📎</span>
                                <input
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    onChange={handleFile}
                                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                                />
                            </div>
                            {fileName && <span className={f.fileName}>✓ {fileName}</span>}
                        </div>
                    </fieldset>

                    {/* ── reCAPTCHA ── */}
                    <div className={f.captchaRow}>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={setCaptchaToken}
                            onExpired={() => setCaptchaToken('')}
                            theme="dark"
                        />
                    </div>

                    {/* ── Submit button ── */}
                    <button type="submit" className={f.submitBtn} disabled={submitting}>
                        {submitting ? '⏳ Sending…' : '✉ Send Message'}
                    </button>

                    {/* ── Status feedback ── */}
                    {submitStatus === 'success' && (
                        <div className={f.statusSuccess} role="alert">
                            <span className={f.statusIcon}>✅</span>
                            <span>
                                <strong>Message sent!</strong><br />
                                Thanks for reaching out — I'll get back to you within 1–2 business days.
                            </span>
                        </div>
                    )}
                    {submitStatus === 'error' && (
                        <div className={f.statusError} role="alert">
                            <span className={f.statusIcon}>⚠</span>
                            <span>
                                <strong>Something went wrong.</strong><br />
                                Please try again or email me directly at{' '}
                                <a href="mailto:flossmore@brandonaboyd.com" style={{ color: '#ff9999' }}>
                                    flossmore@brandonaboyd.com
                                </a>
                            </span>
                        </div>
                    )}
                    {submitStatus === 'nocaptcha' && (
                        <div className={f.statusError} role="alert">
                            <span className={f.statusIcon}>🤖</span>
                            <span>Please complete the CAPTCHA verification before submitting.</span>
                        </div>
                    )}
                </form>
            </div>

        </div>
    );
};

export default ContactForm;
