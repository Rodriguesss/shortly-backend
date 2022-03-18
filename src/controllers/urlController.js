import crypto from 'crypto';
import { connection } from '../database.js';

export async function getUrl(req, res) {
  const { shortUrl } = req.params

  try {
    const { rows } = await connection.query(`
      SELECT id, "shortUrl", url FROM "shortenedUrls" where "shortUrl" = $1
    `, [shortUrl])

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    //return res.json(rows[0]).status(200)
    return res.redirect(302, rows[0].url)
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export async function createUrl(req, res) {
  const { url } = req.body;

  try {
    const { user } = res.locals

    const shortUrl = crypto.randomBytes(4).toString('hex')

    await connection.query(`
      INSERT INTO
        "shortenedUrls"("shortUrl", url, "visitCount", "userId")
      VALUES ($1, $2, $3, $4)
    `, [shortUrl, url, 0, user.id])

    res.json({ shortUrl }).status(201);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;

  try {
    if (id === 'null') return;

    const { user } = res.locals

    const { rows } = await connection.query(`
      SELECT * FROM "shortenedUrls" where id = $1
  `, [id])

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    if (rows[0].userId !== user.id) {
      return res.sendStatus(401);
    }

    await connection.query(`
      DELETE FROM "shortenedUrls" WHERE id = $1
    `, [rows[0].id])

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}