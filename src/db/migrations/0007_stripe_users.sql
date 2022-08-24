CREATE TABLE stripe_users(
  id SERIAL PRIMARY KEY,
  universal_profile_address VARCHAR(100),
  stripe_user_id VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY(universal_profile_address) REFERENCES universal_profiles(address)
);