import { ViewStream } from 'spyne';
import { CmsReadyNullViewTraits } from 'traits/ui/cms-ready-null-view-traits.js';

// Dev only. The CMS plugin fetches the registry through
// CHANNEL_FETCH_REGISTRY_INFO; it can proxify app data only after that lookup
// has answered. This view reports the answer so data channels register
// behind it instead of racing it.
export class CmsReadyNullView extends ViewStream {
  constructor(props = {}) {
    props.channels = ['CHANNEL_FETCH_REGISTRY_INFO'];
    props.traits = [CmsReadyNullViewTraits];
    super(props);
  }

  addActionListeners() {
    return [
      [
        'CHANNEL_FETCH_REGISTRY_INFO_RESPONSE_EVENT|CHANNEL_FETCH_REGISTRY_INFO_ERROR_EVENT',
        'cmsReadyNullView$OnRegistryAnswer',
      ],
    ];
  }
}
