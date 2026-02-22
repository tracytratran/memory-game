const express = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");
const cors = require("cors");

db.run(
  `
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL 
    )
`,
  (err) => {
    //adding default cards if table is empty
    db.get("SELECT COUNT(*) AS count FROM cards", (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return;
      }

      if (row.count === 0) {
        const cards = [
          {
            category: "level-1",
            link: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            category: "level-1",
            link: "https://images.unsplash.com/photo-1596854307809-6e754c522f95?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            category: "level-1",
            link: "https://images.unsplash.com/photo-1597838816882-4435b1977fbe?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            category: "level-1",
            link: "https://plus.unsplash.com/premium_photo-1723708857381-82e3b34187b5?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            category: "level-1",
            link: "https://images.unsplash.com/photo-1735989967755-706e5edcb44b?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
            category: "level-1",
            link: "https://images.unsplash.com/photo-1596797882870-8c33deeac224?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          // level 2
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1510253687831-0f982d7862fc",
          },
          {
            category: "level-2",
            link: "https://sana.ae/wp-content/uploads/2018/10/00-holding-wroclaw-poland-travel-guide.jpg",
          },
          {
            category: "level-2",
            link: "https://onestep4ward.com/wp-content/uploads/2011/08/dreamstime_xxl_55742473-1536x1207.jpg",
          },
          {
            category: "level-2",
            link: "https://hamlettours.com/wp-content/uploads/Nyhavn-ikke-til-print-1024x681.jpg",
          },

          {
            category: "level-2",
            link: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1548013146-72479768bada",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1549145177-238518f1ec1a",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1591139308596-9b663fa6d0a0",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1603852452378-a4e8d84324a2",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1627932384339-3c0fdf74679e",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1526997237335-45a11b46ecb3",
          },

          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1526997237335-45a11b46ecb3",
          },
        ];

        let values = cards
          .map((card) => `('${card.link}', '${card.category}')`)
          .join(", ");

        db.run(`INSERT INTO cards (name, category) VALUES ${values}`);

        console.log("Default cards inserted!");
      }
    });
  },
);

const app = express();

app.use(cors());

const PORT = 8000;
//defualt endpoint
app.get("/", (req, res) => {
  res.send("Hello Express");
});

//endpoint to get all cards from SQLite
app.get("/api/cards", (req, res) => {
  let sql = "SELECT * FROM cards";

  const category = req.query.category;
  if (category) {
    sql += ` WHERE category = '${category}' `;
  }

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
