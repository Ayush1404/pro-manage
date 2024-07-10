import express, { Request, Response } from 'express';
import joi from 'joi';
import { authenticatejwt } from './middlewares/authMiddleware';
import { boardModel } from '../models/boardModel';

const router = express.Router();

// Validation schema for email
const emailValidation = (data: { email: string }) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'string.email': 'Email must be a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
    });
    return schema.validate(data);
};

router.post('/add-member', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        req.body.userid = req.headers.id;
        const { error } = emailValidation({ email });
        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        let board = await boardModel.findOne({ userid: req.headers.id });

        if (!board) {
            // Create a new board if it doesn't exist
            board = new boardModel({
                userid: req.headers.id,
                boardMembers: [email]
            });
        } else {
            if (board.boardMembers.includes(email)) {
                return res.status(400).send({ success: false, message: "Email already added to board members" });
            }
            board.boardMembers.push(email);
        }

        await board.save();

        return res.status(200).send({ success: true, data: board });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.get('/board-members', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers.id;
        const board = await boardModel.findOne({ userid: userId });

        if (!board) {
            return res.status(200).send({ success: true, data: [] });
        }

        return res.status(200).send({ success: true, data: board.boardMembers });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

export { router };
