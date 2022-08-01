async function create(req, res, next) {
  try {
    const db = req.app.get("db");

    const { universalProfileAddress } = req.body;

    const universalProfile = await db.one(
      "INSERT INTO universal_profiles(address, user_id) VALUES($1, $2) RETURNING *",
      [universalProfileAddress, req.user.id]
    );

    res.json(universalProfile);
  } catch (err) {
    console.log(err);
    return next("failed to create universal profile");
  }
}

module.exports = { create };
