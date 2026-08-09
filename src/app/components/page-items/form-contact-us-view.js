import { ViewStream } from 'spyne';
import { FormContactUsTraits } from 'traits/form/form-contact-us-traits.js';

export class FormContactUsView extends ViewStream {
  constructor(props = {}) {
    props.traits = [FormContactUsTraits];
    props.channels = ['CHANNEL_UI'];
    props.mode = 'api';
    // Point this at your own endpoint. Submissions POST here as JSON.
    props.apiUrl = '/api/contact';

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
