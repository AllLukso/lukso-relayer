CREATE TABLE universal_profiles(
  id SERIAL PRIMARY KEY,
  address TEXT,
  user_id INT,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
  );