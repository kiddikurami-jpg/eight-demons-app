import express from "express"
import pkg from "pg"
import cors from "cors"

const { Pool } = pkg
const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.get("/", (req,res)=>{
  res.send("Eight Demons API running")
})

app.post("/signup", async (req,res)=>{
  const {username,password,clubPassword} = req.body

  if(clubPassword !== process.env.CLUB_PASSWORD){
    return res.status(401).json({error:"Invalid club password"})
  }

  const result = await pool.query(
    "insert into users(username,password) values($1,$2) returning username",
    [username,password]
  )

  res.json(result.rows[0])
})

app.post("/login", async (req,res)=>{
  const {username,password} = req.body

  const result = await pool.query(
    "select * from users where username=$1 and password=$2",
    [username,password]
  )

  if(result.rows.length===0){
    return res.status(401).json({error:"invalid"})
  }

  res.json(result.rows[0])
})

app.get("/announcements", async(req,res)=>{
  const result = await pool.query(
    "select * from announcements order by created_at desc"
  )
  res.json(result.rows)
})

app.post("/announcements", async(req,res)=>{
  const {author,title,body} = req.body

  const result = await pool.query(
    "insert into announcements(author,title,body) values($1,$2,$3) returning *",
    [author,title,body]
  )

  res.json(result.rows[0])
})

app.listen(process.env.PORT || 10000,()=>{
  console.log("server running")
})
