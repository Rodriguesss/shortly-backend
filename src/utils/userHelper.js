export function mountAllUserUrls(rows) {
  let shortenedUrls = []

  const { id, name } = rows[0]

  let visitCountTotal = 0;

  rows.forEach(({ shortUrl, url, visitCount, id }) => {
    shortenedUrls.push({ id, shortUrl, url, visitCount })
    visitCountTotal += visitCount;
  })

  const visitCount = visitCountTotal;

  return {
    id,
    name,
    visitCount,
    shortenedUrls
  }
} 