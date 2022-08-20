CREATE TABLE approved_quotas(
  id SERIAL PRIMARY KEY,
  approved_address VARCHAR(100),
  approver_address VARCHAR(100),
  monthly_gas INT,
  gas_used INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY(approver_address) REFERENCES universal_profiles(address)
);