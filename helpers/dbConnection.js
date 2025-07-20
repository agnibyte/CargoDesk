import mysql from "serverless-mysql";

const database = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: "IST",
  },
});

export default function executeQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    database
      .query(query, values)
      .then((results) => {
        resolve(JSON.parse(JSON.stringify(results)));
      })
      .catch((error) => {
        console.error("Database query error ====", error);
        reject(error);
      });
  });
}
