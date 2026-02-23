import { useState } from 'react';

export default function Contact() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error', null
  const [statusMessage, setStatusMessage] = useState('');
  const [throttleMessage, setThrottleMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const trimmedName = formValues.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Name is required';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    const trimmedEmail = formValues.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    const trimmedSubject = formValues.subject.trim();
    if (!trimmedSubject) {
      newErrors.subject = 'Subject is required';
    } else if (trimmedSubject.length > 100) {
      newErrors.subject = 'Subject must be 100 characters or less';
    }

    const trimmedMessage = formValues.message.trim();
    if (!trimmedMessage) {
      newErrors.message = 'Message is required';
    } else if (trimmedMessage.length > 500) {
      newErrors.message = 'Message must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check throttle
    const lastSent = localStorage.getItem('contact_form_last_sent');
    if (lastSent) {
      const timeSinceLastSend = Date.now() - parseInt(lastSent, 10);
      if (timeSinceLastSend < 60000) {
        setThrottleMessage('Please wait before submitting again');
        setTimeout(() => setThrottleMessage(''), 5000);
        return;
      }
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');
    setStatusMessage('');

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      subject: formValues.subject.trim(),
      message: formValues.message.trim(),
      _gotcha: formValues._gotcha,
    };

    try {
      const response = await fetch('https://formspree.io/f/xbdapknk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        // Success
        localStorage.setItem('contact_form_last_sent', Date.now().toString());
        setStatus('success');
        setStatusMessage('Message received. I\'ll be in touch.');
        setFormValues({
          name: '',
          email: '',
          subject: '',
          message: '',
          _gotcha: '',
        });
        setErrors({});
      } else {
        // Formspree error
        setStatus('error');
        setStatusMessage('Something went wrong — email me directly at johnandresyap510@gmail.com.');
      }
    } catch (error) {
      // Network or other error
      setStatus('error');
      setStatusMessage('Something went wrong — email me directly at johnandresyap510@gmail.com.');
    }
  };

  if (status === 'success') {
    return (
      <section className="fade-in visible">
        <h2>Contact</h2>
        <div className="card">
          <div className="card-body">
            <p>{statusMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fade-in visible">
      <h2>Contact</h2>

      {throttleMessage && (
        <div className="contact-status contact-status--error" style={{ marginBottom: '20px' }}>
          {throttleMessage}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className={`contact-field ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="contact-error-text">{errors.name}</div>}
            </div>

            <div className={`contact-field ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="contact-error-text">{errors.email}</div>}
            </div>

            <div className={`contact-field ${errors.subject ? 'error' : ''}`}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formValues.subject}
                onChange={handleInputChange}
              />
              {errors.subject && <div className="contact-error-text">{errors.subject}</div>}
            </div>

            <div className={`contact-field ${errors.message ? 'error' : ''}`}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formValues.message}
                onChange={handleInputChange}
              />
              {errors.message && <div className="contact-error-text">{errors.message}</div>}
            </div>

            <input
              type="text"
              name="_gotcha"
              value={formValues._gotcha}
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />

            <button
              type="submit"
              className="contact-submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send'}
            </button>

            {status === 'error' && (
              <div className="contact-status contact-status--error">
                {statusMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
