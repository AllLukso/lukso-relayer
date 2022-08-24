CREATE TABLE subscriptions(
  id SERIAL PRIMARY KEY,
  universal_profile_address VARCHAR(100),
  signer_address VARCHAR(100),
  stripe_user_id VARCHAR(100),
  plan VARCHAR(100),
  status VARCHAR(100),
  FOREIGN KEY(universal_profile_address) REFERENCES universal_profiles(address)
);