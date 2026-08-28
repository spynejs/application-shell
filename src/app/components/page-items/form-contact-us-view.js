import { ViewStream } from 'spyne';
import { FormContactUsTraits } from 'traits/form/form-contact-us-traits.js';

export class FormContactUsView extends ViewStream {
  constructor(props = {}) {
    props.traits = [FormContactUsTraits];
    props.channels = ['CHANNEL_UI'];
    props.mode = 'api';
    /**
     * Replace this with your own endpoint before deploying — submissions
     * POST here as JSON. The default is the CMS adapter's dev mock, which
     * echoes back whatever it receives so the form works end to end from
     * the first run. Add ?fail=true or ?delay=800 to exercise the error and
     * latency paths.
     */
    props.apiUrl = 'http://localhost:52931/mock/contact';

    // Shown beneath the greeting once a submission succeeds.
    props.successMessage =
      props.successMessage ||
      'Your message has been sent. We will get back to you shortly.';

    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_UI_SUBMIT_EVENT', 'contactUs$SendFormData']];
  }

  broadcastEvents() {
    return [['form', 'submit']];
  }

  onRendered() {}
}
