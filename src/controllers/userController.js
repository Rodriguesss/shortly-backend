import bcrypt from 'bcrypt';
import { connection } from '../database.js';
import { mountAllUserUrls } from '../utils/userHelper.js'

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserUrls(req, res) {
  const { id } = req.params

  try {
    const { rows } = await connection.query(`
    SELECT u.*, s.* FROM users u
      LEFT JOIN "shortenedUrls" s ON s."userId" = u.id WHERE u.id = $1 GROUP BY u.id, s.id
    `, [id])

    if (rows.length === 0) return res.sendStatus(404)

    const result = mountAllUserUrls(rows)

    res.json(result).status(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export async function getUserRanking(req, res) {
  try {
    const { rows } = await connection.query(`
    SELECT u.id, u.name, COUNT(s.id) "linkCount", SUM(s."visitCount") "visitCount" FROM users u
      LEFT JOIN "shortenedUrls" s ON s."userId" = u.id GROUP BY u.id ORDER BY "visitCount" LIMIT 10
    `)

    res.json(rows).status(200)
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}