const Role = require('../schemas/roles');

// GET all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({
            success: true,
            data: roles,
            message: "Lấy danh sách roles thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// GET role by ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy role"
            });
        }
        
        res.status(200).json({
            success: true,
            data: role,
            message: "Lấy thông tin role thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// CREATE new role
exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Tên role là bắt buộc"
            });
        }
        
        const role = new Role({
            name,
            description: description || ""
        });
        
        await role.save();
        
        res.status(201).json({
            success: true,
            data: role,
            message: "Tạo role thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE role
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const role = await Role.findById(id);
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy role"
            });
        }
        
        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        
        await role.save();
        
        res.status(200).json({
            success: true,
            data: role,
            message: "Cập nhật role thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// DELETE role (Soft Delete - Permanent)
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        
        const role = await Role.findByIdAndDelete(id);
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy role"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Xóa role thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
