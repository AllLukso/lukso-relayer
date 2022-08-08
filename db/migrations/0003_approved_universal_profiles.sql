CREATE TABLE approved_universal_profiles(
  approved_address VARCHAR(100),
  approver_address VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY(approved_address) REFERENCES universal_profiles(address),
  FOREIGN KEY(approver_address) REFERENCES universal_profiles(address)
);