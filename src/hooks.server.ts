import qs from 'qs';
import { cms_api } from '$lib/helpers/cms-api';
import { redirect } from '@sveltejs/kit';
import { setLang } from '$lib/i18n';

const enable_test_user = true;

const apiUrl =  'http://localhost:3000';

export const handle = async ({ event, resolve }) => {
  console.log('handle hook')
  let siteId =import.meta.env.PUBLIC_SITE_ID ?? (event.request.headers.get('host') ?? '').split(':')[0];
  // let siteId = '5173'
  event.locals.api = cms_api({
    baseUrl: apiUrl + '/api/' + siteId,
    fetch: event.fetch,
    token: event.cookies.get('token') ?? ''
  });

  event.locals.settings = (await event.locals.api.getSettings()) ?? {};
  if(!event.cookies.get("token")){
    const {token} = await event.locals.api.login({username: "jawad", password: "jawad"})
    event.cookies.set(token)
  }

  // auth
  if (event.cookies.get('token')) {
    const user = await event.locals.api.getUser().then((res) => res.data);

    if (user) {
      event.locals.user = user;
    }
  }

  // filters
  if (event.request.method === 'GET') {
    const obj = qs.parse(event.url.search.substring(1));

    event.locals.filters = obj.filters;
  }
  event.locals.siteId = siteId;
  return resolve(event);
};
