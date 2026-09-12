import { SpyneTrait, ChannelPayloadFilter } from 'spyne';

export class AppSettingsTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'appSettings$';
    super(context, traitPrefix);
  }

  // ---- pure: theme conform ----
  // The store may hand back 'auto' (storageConfig default) or anything else;
  // the CSS knows only [data-theme='dark'] vs. everything-else-is-light, so
  // the channel conforms every value to one of the two modes it emits.
  static appSettings$ResolveTheme(value) {
    return value === 'dark' ? 'dark' : 'light';
  }

  static appSettings$NextTheme(current) {
    return AppSettingsTraits.appSettings$ResolveTheme(current) === 'dark'
      ? 'light'
      : 'dark';
  }

  // ---- channel: settings state ----
  static appSettings$OnSettingEvent(e) {
    let { settingsType, settingsValue } = e.payload;

    if (settingsType === 'theme') {
      // the button's dataset carries the current mode; the channel derives
      // the next one and emits complete state for every consumer
      settingsValue = this.appSettings$NextTheme(settingsValue);
    }

    const action = 'CHANNEL_APP_SETTING_EVENT';

    this.sendChannelPayload(action, { settingsType, settingsValue });
  }

  static appSettings$InitSettingEvents() {
    const settingsBtnFilter = new ChannelPayloadFilter({
      eventType: 'setting',
      action: 'CHANNEL_UI_CLICK_EVENT',
    });

    this.getChannel('CHANNEL_UI', settingsBtnFilter).subscribe(
      this.appSettings$OnSettingEvent.bind(this),
    );
  }
}
