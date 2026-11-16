module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'admin_secret_fallback_key_123456'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'token_salt_fallback_key_123456'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'transfer_salt_key_123456'),
    },
  },
});
