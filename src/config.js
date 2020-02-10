module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://karinagaulin@localhost/inspiration-cloud',
}