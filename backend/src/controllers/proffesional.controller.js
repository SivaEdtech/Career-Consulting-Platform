import pool from "../config/mysql.js";

const getProfessional = async (req, res) => {
    try {
        const account_id = req.user?.account_id;
        console.log(account_id)

        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const [rows] = await pool.query(
            `SELECT * FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Professional user not found." });
        }

        return res.status(200).json({
            message: "Professional user fetched successfully",
            professional: rows[0]
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching professional user info",
            error: err.message,
        });
    }
};



const updateProfessional = async (req, res) => {
    try {
        const account_id = req.user?.account_id;
        if (!account_id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const allowedUpdates = {
            name: req.body.name,
            profile_photo: req.body.profile_photo,
            bio: req.body.bio,
            languages: req.body.languages ? JSON.stringify(req.body.languages) : undefined,
            consulting_price: req.body.consulting_price,
        };

        // Generate a default profile photo if not supplied but name is updated
        if (req.body.name && !req.body.profile_photo) {
            const initials = encodeURIComponent(req.body.name);
            allowedUpdates.profile_photo = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`;
        }

        // Remove undefined fields
        Object.keys(allowedUpdates).forEach(
            (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update." });
        }

        // Prepare SET clause and values for parameterized query
        const setClause = Object.keys(allowedUpdates)
            .map((field) => `${field} = ?`)
            .join(", ");
        const values = Object.values(allowedUpdates);
        values.push(account_id);

        // Attempt the update in the professional table
        const [updateResult] = await pool.query(
            `UPDATE professionals SET ${setClause} WHERE account_id = ?`,
            values
        );

        if (!updateResult.affectedRows) {
            return res.status(404).json({ message: "Professional not found" });
        }

        // Fetch updated professional user
        const [rows] = await pool.query(
            `SELECT * FROM professionals WHERE account_id = ?`,
            [account_id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "Professional user not found after update." });
        }

        return res.status(200).json({
            message: "Professional user updated successfully",
            updatedProfessional: rows[0]
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error while updating professional user info",
            error: err.message,
        });
    }
};


const getAllProfessionals = async (req, res) => {
    try {
        // Get all professionals from the table
        const [rows] = await pool.query(
            `SELECT * FROM professionals`
        );

        const professionals = rows.map((professional) => {
            if (professional.languages && typeof professional.languages === "string") {
                try { professional.languages = JSON.parse(professional.languages); }
                catch { professional.languages = []; }
            }
            return professional;
        });

        return res.status(200).json({
            message: "Fetched all professionals successfully",
            professionals
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching professionals",
            error: err.message,
        });
    }
};

const getProfessionalById = async (req, res) => {
    try {
        const professionalId = req.params.professionalId;
        if (!professionalId) {
            return res.status(400).json({
                message: "Professional ID is required"
            });
        }

        const [rows] = await pool.query(
            `SELECT * FROM professionals WHERE id = ?`,
            [professionalId]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "Professional not found"
            });
        }

        const professional = rows[0];
        if (professional.languages && typeof professional.languages === "string") {
            try { professional.languages = JSON.parse(professional.languages); }
            catch { professional.languages = []; }
        }

        return res.status(200).json({
            message: "Fetched professional successfully",
            professional
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching professional",
            error: err.message,
        });
    }
};


export { getProfessional, updateProfessional, getAllProfessionals, getProfessionalById }
