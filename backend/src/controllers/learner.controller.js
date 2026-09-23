import pool from "../config/mysql.js";


const getLearner = async(req, res) => {
    try {
     
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }
  
    
      const { account_id } = user;

      // Fetch learner-specific details from learner table using the account_id as foreign key
      const [learnerRows] = await pool.query(
        "SELECT * FROM learner WHERE account_id = ?",
        [account_id]
      );
      const learner = learnerRows[0];
      console.log(learner)

      if (learner.length == 0) {
        return res.status(404).json({ message: "Learner profile not found" });
      }

      return res.status(200).json({
        message:"learner details fetched successfully",
        learner
      });
    } catch (err) {
      console.error("GetMe error:", err);
      return res.status(500).json({ message: "Server error during getLearner" });
    }
  };
  
  
  const updateLearner = async (req, res) => {
    try {
      const account_id = req.user?.account_id;
      if (!account_id) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }
  
      const allowedUpdates = {
        name: req.body.displayName,
        profile_photo: req.body.profile_photo,
        education_background: req.body.education_background,
        bio: req.body.bio,
        interests: req.body.interests ? JSON.stringify(req.body.interests) : undefined
      };
  
  
      if (req.body.displayName && !req.body.profile_photo) {
        const initials = encodeURIComponent(req.body.displayName);
        allowedUpdates.profile_photo = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`;
      }
  
      
      Object.keys(allowedUpdates).forEach(
        (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
      );
  
      if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }
  
      // Prepare SET clause and values
      const setClause = Object.keys(allowedUpdates).map(field => `${field} = ?`).join(", ");
      const values = Object.values(allowedUpdates);
      values.push(account_id);
  
      // Do the update
      const [updateResult] = await pool.query(
        `UPDATE learner SET ${setClause} WHERE account_id = ?`,
        values
      );
  
      if (!updateResult.affectedRows) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch updated user
      const [rows] = await pool.query(
        "SELECT * FROM learner WHERE account_id = ?",
        [account_id]
      );
  
      if (!rows.length) {
        return res.status(404).json({ message: "User not found after update." });
      }
  
      return res.status(200).json({
        message: "User updated successfully",
        updatedUser: rows[0]
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Error while updating user info",
      });
    }
  };


  export {getLearner , updateLearner}