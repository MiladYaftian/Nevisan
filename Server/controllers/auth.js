const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const secret = process.env.SECRET;

const signupUser = async (req, res) => {
    const { username, password, email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).send({ message: 'لطفا از یک ایمیل معتبر استفاده کنید' });
    }
    if (!password || password.length < 6) {
        return res.status(400).send({ message: "رمز عبور باید حداقل 6 نویسه باشد" });
    }

    if (!username || username.length < 3 || username.length > 20) {
        return res.status(400).send({ message: "نام کاربری باید حداقل 3 نویسه و حداکثر 20 نویسه باشد" });
    }

    const existingUser = await User.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } });

    if (existingUser) {
        return res.status(400).send({ message: "با این نام کاربری از قبل حسابی در سایت وجود دارد" });
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ email, username, passwordHash });
        const savedUser = await newUser.save();

        const payloadForToken = {
            _id: savedUser._id,
        };

        const token = jwt.sign(payloadForToken, secret);

        res.status(200).send({
            token,
            username: savedUser.username,
            likes: 0,
            avatar: savedUser.avatar,
            id: savedUser._id,
        });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
};


const loginUser = async(req,res) => {
    const{username, password} = req.body;

    const user = await User.findOne({
        username: {$regex : new RegExp("^" + username + "$", "i")} 
    })

    if(!user) {
        return res.status(400).send({message: "هیج حسابی با این مشخصات یافت نشد"})
    }

    const credentialsValid = await bcrypt.compare(password, user.passwordHash);

    if(!credentialsValid) {
        return res.status(401).send({message: 'نام کاربری یا رمزعبور نامعتبر'})
    }

    const payloadForToken = {
        _id: user._id,
    }

    const token = jwt.sign(payloadForToken, secret);

    return res.status(200).send({
        token,
        username: user.username,
        id: user._id,
        avatar: user.avatar,
        likes: user.postLikes + user.commentLikes
    })
}


module.exports = {signupUser, loginUser}