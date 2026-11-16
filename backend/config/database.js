module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'postgres'),
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'lens_and_light_db'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'postgres'),
      ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
      schema: env('DATABASE_SCHEMA', 'public'),
    },
    pool: { min: 2, max: 10 },
  },
});
