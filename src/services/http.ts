/** Mock helpers. Replace with a real axios/fetch client when connecting to the Laravel API. */
export const delay = (min = 300, max = 600) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

export function paginate<T>(items: T[], page = 1, perPage = 10) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const current_page = Math.min(Math.max(1, page), last_page);
  const start = (current_page - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: { current_page, per_page: perPage, total, last_page },
  };
}

export class ApiError extends Error {}
