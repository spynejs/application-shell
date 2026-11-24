import { ICON_SHAPES } from 'traits/utils/icon-shapes.js';

/**
 * The shape of the icon of that name, as the `d` of an SVG path; an empty string
 * where this app has no icon of that name, so nothing is drawn.
 *
 * The names are the keys of ICON_SHAPES (icon-shapes.js).
 */
export const iconPath = (name) =>
  typeof name === 'string' && Object.hasOwn(ICON_SHAPES, name)
    ? ICON_SHAPES[name]
    : '';

/** Whether this app has an icon of that name. */
export const hasIcon = (name) => iconPath(name) !== '';
