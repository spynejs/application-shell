// Where a call to action leads when the page it names is not a page of the app.
//
// A call to action is a button with words on it: a hero's, a banner's, a row's of a
// split feature. It names where it leads by the route's ids (attrPageId, attrTopicId),
// and its button is a ROUTE anchor, which reads those ids and never its href. An id
// that is empty sends it to the start of the site, and one that is no page of the app
// to the "not found" page. Neither is what a button with words on it means.
//
// So before a page is shown, each of its calls to action whose ids are not a route of
// the app is given the default: the page that holds the contact form, the one place
// an app keeps for acting on what a page says. On that page itself such a call to
// action is given nowhere to go, and a button with nowhere to go is not drawn: the
// form is already there to be filled in.
//
// Because of this, the data need not name a destination at all. A call to action
// with only its words leads to the contact page.
//
// These are ordinary functions with no framework in them. The app's channel calls
// routeCallsToAction on a page's data as it sends it (AppStatusTraits), on its own
// copy of that data: what was authored is not written over at its source.

const CONTACT_TEMPLATE = 'contact-us.tmpl.html';

const hasWords = (text) => typeof text === 'string' && text.trim() !== '';

const isCallToAction = (item) =>
  item !== null && typeof item === 'object' && hasWords(item.ctaText);

const holdsContactForm = (node) =>
  (node?.pageItems ?? []).some(
    (item) => item?.props?.template === CONTACT_TEMPLATE,
  );

/**
 * The page of the app that holds the contact form, as the route ids that lead to
 * it: { pageId, topicId }. A sub-page is looked for first, since that is where an
 * app that has both an About page and a contact page keeps it. null when the app
 * has no contact form.
 */
export const contactRouteOf = (model) => {
  const pages = model?.content ?? [];

  for (const page of pages) {
    const sub = (page.content ?? []).find(holdsContactForm);

    if (sub !== undefined) {
      return { pageId: page.pageId, topicId: sub.topicId };
    }
  }

  const page = pages.find(holdsContactForm);

  return page === undefined ? null : { pageId: page.pageId, topicId: '' };
};

/**
 * Whether the ids are a page of the app: `pageId` one of its pages, and `topicId`,
 * where there is one, one of that page's sub-pages.
 */
export const isRouteOf = (model, pageId, topicId = '') => {
  const page = (model?.content ?? []).find((p) => p.pageId === pageId);

  if (page === undefined || !hasWords(pageId)) {
    return false;
  }

  return (
    !hasWords(topicId) ||
    (page.content ?? []).some((s) => s.topicId === topicId)
  );
};

// A call to action's address is `attrCtaHref`, except a split feature's row, whose
// key for it is `ctaHref`.
const hrefKeyOf = (item) => ('ctaHref' in item ? 'ctaHref' : 'attrCtaHref');

const sameRoute = (a, b) =>
  a !== null &&
  b !== null &&
  a.pageId === b.pageId &&
  (a.topicId ?? '') === (b.topicId ?? '');

/**
 * Gives every call to action of a page somewhere to go. `node` is the page's data
 * (a copy the caller may change); `model` is the whole app's; `hrefOf` turns route
 * ids into an address the way the app's routes are written.
 *
 *   - ids that are a page of the app: left as they are;
 *   - a page that is, with a sub-page that is not: the page;
 *   - anything else: the contact page; or, on the contact page itself or in an app
 *     with none, nowhere (empty ids, which the styles do not draw).
 */
export const routeCallsToAction = (node, model, hrefOf) => {
  const contact = contactRouteOf(model);
  const here = { pageId: node?.pageId, topicId: node?.topicId ?? '' };
  const fallback = sameRoute(contact, here) ? null : contact;

  const route = (item) => {
    const { attrPageId, attrTopicId } = item;

    if (isRouteOf(model, attrPageId, attrTopicId)) {
      return;
    }

    const to = isRouteOf(model, attrPageId)
      ? { pageId: attrPageId, topicId: '' }
      : fallback;

    item.attrPageId = to === null ? '' : to.pageId;
    item.attrTopicId = to === null ? '' : to.topicId;
    item[hrefKeyOf(item)] = to === null ? '' : hrefOf(to);
  };

  const routeAllIn = (data) => {
    if (isCallToAction(data)) {
      route(data);
    }

    Object.values(data ?? {})
      .filter(Array.isArray)
      .forEach((list) => list.filter(isCallToAction).forEach(route));
  };

  if (isCallToAction(node?.hero)) {
    route(node.hero);
  }

  (node?.pageItems ?? [])
    .filter((item) => item?.props?.template !== CONTACT_TEMPLATE)
    .forEach((item) => routeAllIn(item?.props?.data));

  return node;
};
