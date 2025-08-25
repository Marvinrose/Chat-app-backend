"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prismaClient_1 = require("../prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        const user = await prismaClient_1.prisma.user.create({ data: { username, email, password: hashedPassword } });
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: 'User already exists' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prismaClient_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
};
exports.login = login;
//# sourceMappingURL=authController.js.map