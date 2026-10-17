import { SpyneTrait } from 'spyne';

export class CmsReadyNullViewTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'cmsReadyNullView$';
    super(context, traitPrefix);
  }

  // Either answer means the CMS has settled — an error (adapter not running)
  // should not hold the app's data back. One-shot: the view retires itself.
  static cmsReadyNullView$OnRegistryAnswer(e, props = this.props) {
    props.onReady?.();
    this.disposeViewStream();
  }
}
