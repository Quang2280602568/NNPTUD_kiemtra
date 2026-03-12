const User = require('../schemas/users');

// GET all users (không hiển thị đã xóa)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json({
            success: true,
            data: users,
            message: "Lấy danh sách users thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }
        
        if (user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User này đã bị xóa"
            });
        }
        
        res.status(200).json({
            success: true,
            data: user,
            message: "Lấy thông tin user thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// CREATE new user
exports.createUser = async (req, res) => {
    try {
        const { username, password, email, fullName, role, avatarUrl, status } = req.body;
        
        // Validation
        if (!username || !password || !email || !role) {
            return res.status(400).json({
                success: false,
                message: "Username, password, email và role là bắt buộc"
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username hoặc email đã tồn tại"
            });
        }
        
        const user = new User({
            username,
            password,
            email,
            fullName: fullName || "",
            avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
            status: status || false,
            role,
            loginCount: 0,
            isDeleted: false
        });
        
        await user.save();
        const userWithRole = await user.populate('role');
        
        res.status(201).json({
            success: true,
            data: userWithRole,
            message: "Tạo user thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, fullName, avatarUrl, status, role, loginCount } = req.body;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }
        
        if (user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User này đã bị xóa"
            });
        }
        
        // Update fields
        if (password) user.password = password;
        if (fullName !== undefined) user.fullName = fullName;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        if (status !== undefined) user.status = status;
        if (role) user.role = role;
        if (loginCount !== undefined) user.loginCount = loginCount;
        
        await user.save();
        const updatedUser = await user.populate('role');
        
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "Cập nhật user thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// DELETE user (Soft Delete)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }
        
        if (user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User này đã được xóa rồi"
            });
        }
        
        // Soft delete: chỉ set isDeleted = true
        user.isDeleted = true;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "Xóa user thành công (soft delete)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// RESTORE deleted user (Hard delete - thực sự xóa)
exports.restoreUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }
        
        user.isDeleted = false;
        await user.save();
        
        res.status(200).json({
            success: true,
            data: user,
            message: "Khôi phục user thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// ENABLE user (set status = true)
exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        
        // Validation
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: "Email và username là bắt buộc"
            });
        }
        
        // Tìm user theo email và username
        const user = await User.findOne({ email, username });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user với email và username này"
            });
        }
        
        if (user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User này đã bị xóa"
            });
        }
        
        // Update status to true
        user.status = true;
        await user.save();
        
        res.status(200).json({
            success: true,
            data: user,
            message: "Kích hoạt user thành công (status = true)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// DISABLE user (set status = false)
exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        
        // Validation
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: "Email và username là bắt buộc"
            });
        }
        
        // Tìm user theo email và username
        const user = await User.findOne({ email, username });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user với email và username này"
            });
        }
        
        if (user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User này đã bị xóa"
            });
        }
        
        // Update status to false
        user.status = false;
        await user.save();
        
        res.status(200).json({
            success: true,
            data: user,
            message: "Vô hiệu hóa user thành công (status = false)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// GET all users by role ID
exports.getUsersByRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        
        // Validation
        if (!roleId) {
            return res.status(400).json({
                success: false,
                message: "Role ID là bắt buộc"
            });
        }
        
        // Tìm tất cả users có role bằng roleId và không bị xóa
        const users = await User.find({ 
            role: roleId,
            isDeleted: false 
        }).populate('role');
        
        // Nếu tìm được users
        if (users.length === 0) {
            return res.status(404).json({
                success: true,
                data: [],
                message: "Không có user nào với role này"
            });
        }
        
        res.status(200).json({
            success: true,
            data: users,
            total: users.length,
            message: `Lấy danh sách ${users.length} user(s) có role này thành công`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
