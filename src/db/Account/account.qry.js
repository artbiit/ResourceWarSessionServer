const Account_Qry = Object.freeze({
  EXISTS_USER_BY_USERNAME_AND_NICKNAME: `SELECT 
    id,
    CASE 
        WHEN user_name = $1 THEN 'user_name'
        WHEN nickname = $2 THEN 'nickname'
    END AS conflict_type
FROM Account
WHERE user_name = $1 OR nickname = $2;`,
  FIND_USER_BY_ID: `SELECT nickname, user_name, password FROM Account WHERE id = ($1);`,
  FIND_USER_BY_USERNAME: `SELECT id, nickname, password FROM Account WHERE user_name = ($1);`,
  INSERT_USER: `INSERT INTO Account (nickname, user_name, password, create_at, update_at) VALUES ($1, $2, $3, DEFAULT, DEFAULT) RETURNING id`,
});

export default Account_Qry;
