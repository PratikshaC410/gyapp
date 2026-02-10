const nodemailer = require("nodemailer");
require("dotenv").config();
const { userdb, otpdb, postsdb, contactdb } = require("./database");
const bcrypt = require("bcryptjs");
const expire_time = new Date(Date.now() + 10 * 60 * 1000);
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "chougulepratiksha23@gmail.com",
    pass: process.env.GOOGLE_SECRET_KEY,
    expiresIn: "15m",
  },
});

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await userdb.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    //hashing of password
    const saltRound = 10;
    const hash_password = await bcrypt.hash(password, saltRound);

    // create user
    await userdb.create({
      username,
      email,
      password: hash_password,
      isVerified: false,
    });

    // generate OTP
    const otp = generateOTP();
    //hashing of otp
    const saltround = 10;
    const hash_otp = await bcrypt.hash(otp, saltround);
    // save OTP
    await otpdb.create({
      username,
      email,
      otp: hash_otp,
      num_attempts: 0,
      is_otp_used: false,
      expire_time,
    });

    // send OTP email
    await transporter.sendMail({
      from: '"Gyan-App" <chougulepratiksha23@gmail.com>',
      to: `${email}`,
      subject: "Email Verification OTP",
      html: `<p>Your verification code is <b>${otp}</b>. Please enter it to verify your email.</p>`,
    });

    return res
      .status(200)
      .json({ msg: "Registered successfully. OTP sent to email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "error" });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otprecord = await otpdb.findOne({ email });

    if (!otprecord) {
      return res.status(404).json({ msg: "Invalid email" });
    }

    if (otprecord.expire_time < new Date()) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    const match_otp = await bcrypt.compare(otp, otprecord.otp);
    if (match_otp) {
      // mark user verified
      await userdb.updateOne({ email }, { $set: { isVerified: true } });
      //make changes in otpdb
      await otpdb.updateOne(
        { email },
        {
          $set: { is_otp_used: true },
          $inc: { num_attempts: 1 },
        },
      );

      return res.status(200).json({ msg: "Email verified successfully" });
    } else {
      return res.status(400).json({ msg: "OTP is invalid" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userdb.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password!" });
    }

    const token = await user.generateToken();

    return res.status(200).json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(400).json({ msg: "error in login" });
  }
};

const pop_close = async (req, res) => {
  try {
    const { email } = req.body;

    await otpdb.updateOne(
      { email },
      {
        $set: { is_otp_used: true },
        $inc: { num_attempts: 1 },
      },
    );

    return res.status(200).json({ msg: "OTP popup closed" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "error closing OTP" });
  }
};

const user = async (req, res) => {
  try {
    const userdata = req.user;
    console.log(userdata);
    res.status(200).json({
      msg: userdata,
    });
  } catch (error) {
    res.status(400).json({ msg: "Error" });
  }
};

const create_posts = async (req, res) => {
  try {
    const post = await postsdb.create({
      ...req.body,
      resources: req.body.resources?.map((r) => ({ details: r })),
      user: req.userId,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to create post" });
  }
};

const view_posts = async (req, res) => {
  try {
    const posts = await postsdb.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
};

const view_my_posts = async (req, res) => {
  try {
    const posts = await postsdb.find({ user: req.userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch my posts" });
  }
};

const delete_my_posts = async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await postsdb.deleteOne({
      _id: postId,
      user: req.userId,
    });

    if (!result.ok) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    res.status(200).json({
      msg: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error deleting your post",
    });
  }
};

const contactresponse = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await contactdb.create({ email, message });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const public_posts = async (req, res) => {
  try {
    const posts = await postsdb
      .find(
        {},
        {
          _id: 1,
          company_name: 1,
          fullName: 1,
          passoutYear: 1,
          placedYear: 1,
        },
      )
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch public posts" });
  }
};

//to get the required posts with the fille data
const get_single_post = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postsdb.findOne({
      _id: postId,
      user: req.userId,
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching post" });
  }
};

//to update the data req
const update_my_post = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postsdb.findOne({
      _id: postId,
      user: req.userId,
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (req.body.resources) {
      req.body.resources = req.body.resources.map((r) => ({ details: r }));
    }

    Object.assign(post, req.body);
    await post.save();

    res.status(200).json({ msg: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating post" });
  }
};

module.exports = {
  register,
  verifyotp,
  login,
  pop_close,
  user,
  create_posts,
  view_posts,
  view_my_posts,
  delete_my_posts,
  get_single_post,
  update_my_post,
  contactresponse,
  public_posts,
};
