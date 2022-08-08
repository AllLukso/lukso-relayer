CREATE TABLE transactions(
  id SERIAL PRIMARY KEY,
  universal_profile_address VARCHAR(100),
  nonce VARCHAR(100),
  signature TEXT,
  abi TEXT,
  channel_id INT,
  status VARCHAR(100),
  signer_address VARCHAR(100),
  hash VARCHAR(1000),
  relayer_nonce VARCHAR(100),
  relayer_address VARCHAR(100),
  FOREIGN KEY(universal_profile_address) REFERENCES universal_profiles(address),
  UNIQUE (nonce, channel_id, signer_address)
);