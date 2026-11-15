import { SpyneTrait, ViewStream } from 'spyne';
import UIFooterContentTmpl from 'components/ui-elements/templates/ui-footer-content.tmpl.html';

export class UIFooterViewTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'uiFooter$';
    super(context, traitPrefix);
  }

  static uiFooter$OnAppDataEvent(e) {
    this.appendView(
      new ViewStream({
        data: e.payload,
        class: 'footer-content',
        template: UIFooterContentTmpl,
      }),
    );
  }
}
