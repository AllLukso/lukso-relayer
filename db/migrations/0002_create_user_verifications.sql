CREATE TABLE user_verifications(id SERIAL PRIMARY KEY, guid VARCHAR(70), user_id INT, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id));