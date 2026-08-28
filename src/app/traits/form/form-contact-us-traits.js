import { ChannelFetchUtil, SpyneTrait } from 'spyne';

export class FormContactUsTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'contactUs$';
    super(context, traitPrefix);
  }

  static contactUs$SendFormData(e, props = this.props) {
    const { srcElement } = e;

    const { mode, apiUrl } = props;

    const form = srcElement.el;
    const formData = new FormData(form);

    const formDataObj = {
      name: formData.get('fullName'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // held for the success state, which greets the sender by name
    this.props.submittedData = formDataObj;

    if (mode === 'api') {
      this.contactUs$SendFormViaApi(formDataObj, apiUrl);
    } else {
      this.contactUs$SendFormViaEmail(formDataObj);
    }
  }

  static contactUs$SendFormViaEmail({ name, email, message }) {
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:test@test.com?subject=${subject}&body=${body}`;
  }

  static contactUs$SendFormViaApi(body, apiUrl) {
    new ChannelFetchUtil(
      {
        url: apiUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      },
      this.contactUs$OnSuccess.bind(this),
    );
  }

  /**
   * Swaps the form for the success state: a heading that greets the sender
   * by name, with the confirmation message beneath it. The status container
   * carries role="status", so assistive technology announces it without
   * moving focus. Values are written via innerText, never markup.
   */
  static contactUs$OnSuccess(e, props = this.props) {
    const { successMessage, submittedData } = props;
    const name = submittedData?.name?.trim();

    const titleEl = this.props.el$('.contact-us__status-title').el;
    const msgEl = this.props.el$('.contact-us__status-msg').el;

    if (titleEl !== null) {
      titleEl.innerText = name ? `Thanks, ${name}.` : 'Thanks.';
    }

    if (msgEl !== null) {
      msgEl.innerText = successMessage;
    }

    this.props.el$.addClass('contact-us--submitted');
  }

}
