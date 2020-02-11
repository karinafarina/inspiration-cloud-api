module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_BASE_URL: process.env.REACT_APP_BASE_URL,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://karinagaulin@localhost/inspiration-cloud',
}