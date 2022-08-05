CREATE TABLE transactions_v3(
  id SERIAL PRIMARY KEY,
  universal_profile_address VARCHAR(100),
  nonce VARCHAR(100),
  signature TEXT,
  abi TEXT,
  channel_id INT,
  status VARCHAR(100),
  signer_address VARCHAR(100),
  hash VARCHAR(1000),
  FOREIGN KEY(universal_profile_address) REFERENCES universal_profiles_v3(address),
  UNIQUE (nonce, channel_id, signer_address)
);