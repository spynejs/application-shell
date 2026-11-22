import { ChannelPayloadFilter, ViewStream } from 'spyne';
import { StageContainerTraits } from 'traits/app/stage-container-traits.js';

export class StageContainer extends ViewStream {
  constructor(props = {}) {
    props.id = 'stage-view';
    props.traits = [StageContainerTraits];
    props.channels = ['CHANNEL_APP', 'CHANNEL_ROUTE'];
    props.template = `<div class="slot slot-ui"></div>
                      <div class="slot slot-page  page-container "></div>`;
    super(props);
  }

  addActionListeners() {
    // A change of route that began on a link: it carries the link that was
    // followed. One by the browser's own Back or Forward carries none. (The
    // route's own `isHistory` does not tell them apart: it is false for a Back
    // that lands on the page first loaded.)
    const byLinkFilter = new ChannelPayloadFilter({
      srcElement: (link) => link?.el !== undefined,
    });

    return [
      ['CHANNEL_APP_INIT_EVENT', 'stage$OnAppInitEvent'],
      ['CHANNEL_APP_PAGE_DATA_EVENT', 'stage$OnRouteEvent'],
      ['CHANNEL_ROUTE_CHANGE_EVENT', 'stage$ArriveAtTop', byLinkFilter],
    ];
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {
    this.stage$OnRendered();
  }
}
