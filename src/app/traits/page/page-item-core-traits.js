import { SpyneTrait, ViewStream, SpyneAppProperties, safeClone } from 'spyne';
import { iconPath } from 'traits/utils/icons.js';
import { HeroView } from 'components/page-items/hero-view.js';
import { CardsContainerView } from 'components/page-items/cards-container-view.js';
import { FormContactUsView } from 'components/page-items/form-contact-us-view.js';

export class PageItemCoreTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'pageItemCore$';
    super(context, traitPrefix);
  }

  static pageItemCore$AddStyles(element, cssString) {
    if (!element) return;
    if (typeof cssString !== 'string' || !cssString.trim()) return;

    // Check for an existing Spyne inline style
    const existing = element.querySelector(
      'style[data-spyne-inline-style="true"]',
    );
    if (existing) {
      existing.textContent = cssString;
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-spyne-inline-style', 'true');
    styleTag.textContent = cssString;

    element.appendChild(styleTag);
  }

  static pageItemCore$CheckToAddPageTraitContainer(options = {}) {
    const {
      isEnabled = true,
      classOptions = {},
      spacing = 'default',
      selector,
    } = options;

    if (selector) {
      return selector;
    }

    const getContainerClass = () => {
      const classes = ['page-item'];

      // ---------------------------------------------
      // Variant (surface style)
      // ---------------------------------------------
      if (classOptions.variant) {
        classes.push(`page-item--${classOptions.variant}`);
      }

      // ---------------------------------------------
      // Flush (remove internal padding)
      // ---------------------------------------------
      if (classOptions.flush === true) {
        classes.push('page-item--flush');
      }

      // ---------------------------------------------
      // Bleed (full-width section)
      // ---------------------------------------------
      if (classOptions.bleed === true) {
        classes.push('page-item--bleed');
      }

      // ---------------------------------------------
      // Spacing (vertical rhythm)
      // ---------------------------------------------
      if (spacing === 'none') {
        classes.push('page-item--no-spacing');
      }

      if (spacing === 'tight') {
        classes.push('page-item--tight-spacing');
      }

      return classes.join(' ');
    };

    if (isEnabled) {
      const props = {};
      props.class = getContainerClass();

      const vs = new ViewStream(props);
      this.appendView(vs, '.page-body');
      return vs.props.id$;
    }

    return '.page-body';
  }

  /**
   * An icon asked for by name: its shape, put beside the name.
   *
   * A model names an icon with an `icon` key (app.model.json):
   *
   *   { "icon": "schedule", "name": "Open late" }
   *
   * A template cannot look a shape up, so this does, before the template
   * renders: beside every `icon` it adds `attrIconPath`, which a template
   * writes as the path of an SVG:
   *
   *   <svg class="icon" viewBox="0 -960 960 960" aria-hidden="true">
   *     <path d="{{attrIconPath}}" />
   *   </svg>
   *
   * It is given to the data itself where that has an `icon`, and to each item
   * of a list in the data that has one. The names are those of ICON_SHAPES
   * (traits/utils/icon-shapes.js). A name that is not among them gets an empty
   * path, and nothing is drawn.
   *
   * Data with no `icon` in it is handed back as it came. The authored keys
   * are left as they are; safeClone keeps what the CMS has put on the data.
   */
  static pageItemCore$PlaceIcons(data) {
    if (data === null || typeof data !== 'object') {
      return data;
    }

    const namesAnIcon = (item) =>
      item !== null && typeof item === 'object' && item.icon !== undefined;
    const itemsOf = (obj) =>
      Object.values(obj).filter(Array.isArray).flat().filter(namesAnIcon);

    if (!namesAnIcon(data) && itemsOf(data).length === 0) {
      return data;
    }

    const shaped = safeClone(data);

    [shaped, ...itemsOf(shaped)].filter(namesAnIcon).forEach((item) => {
      item.attrIconPath = iconPath(item.icon);
    });

    return shaped;
  }

  static pageItemCore$AddPageItems(elementsArr = this.props.data.pageItems) {
    const addElement = (obj) => {
      const { props, container, viewClass, isPrototype } = obj;
      props.template = this.pageItemCore$GetTemplate(props, isPrototype);
      props.data = PageItemCoreTraits.pageItemCore$PlaceIcons(props.data);

      const ViewClass = this.pageItemCore$GetViewClass(viewClass);

      const appendElSelector =
        this.pageItemCore$CheckToAddPageTraitContainer(container);

      const view = new ViewClass(props);

      this.appendView(view, appendElSelector);

      if (props?.styles) {
        PageItemCoreTraits.pageItemCore$AddStyles(view.props.el, props.styles);
      }
    };

    elementsArr.forEach(addElement);
  }

  static pageItemCore$onRendered(props = this.props) {
    const { hero, pageItems, content, pageType } = props.data;

    if (hero) {
      this.appendView(new HeroView({ data: hero, pageType }), '.page-heading');
    }

    if (content) {
      this.appendView(
        new CardsContainerView({ data: content, pageType }),
        '.page-body',
      );
    }

    if (pageItems) {
      this.pageItemCore$AddPageItems();
    }
  }

  static pageItemCore$GetTemplate(
    pageItemProps = { template: '' },
    isPrototype = true,
  ) {
    const { template } = pageItemProps;

    if (isPrototype === true) {
      return template;
    }

    const templateLookup = SpyneAppProperties.getProp('pageItemTemplateLookup');
    if (isPrototype === false) {
      return templateLookup[template] || '<h1>Missing Template</h1>';
    }
    return template;
  }

  static pageItemCore$GetViewClass(viewClass = 'ViewStream') {
    const classLookup = {
      ContactUsView: FormContactUsView,
    };
    return classLookup[viewClass] || ViewStream;
  }
}
