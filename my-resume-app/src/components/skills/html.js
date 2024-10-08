import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../../css/HTML.css'; // Link your external CSS file

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'Praise Submission',
        attachment: null // Assuming you want to handle file attachment
    });
    const [captchaToken, setCaptchaToken] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!captchaToken) {
            alert('Please complete the CAPTCHA');
            setSubmitting(false);
            return;
        }

        try {
            // Implement your form submission logic here
            console.log('Form submitted:', formData);
            alert('Form submitted successfully!');
            // Reset form after submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                inquiryType: 'Praise Submission',
                attachment: null
            });
            // Reset CAPTCHA
            setCaptchaToken('');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="contact-form">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type:</label>
                    <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                    >
                        <option value="Praise Submission">Praise Submission</option>
                        <option value="Technical">Technical</option>
                        <option value="Resume Inquiry">Resume Inquiry</option>
                        <option value="General Request">General Request</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="attachment">Attach File:</label>
                    <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                    />
                </div>
                <div className="form-group">
                    <ReCAPTCHA
                        sitekey="your_site_key_here"
                        onChange={handleCaptchaChange}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;

