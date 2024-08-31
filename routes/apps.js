const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const App = require("../models/App");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Home page: list apps
router.get("/", async (req, res) => {
  const apps = await App.find();
  const userId = req.session ? req.session.userId : null;
  res.render("index", { apps, user: userId });
});

// App detail page
router.get("/app/:id", async (req, res) => {
  const app = await App.findById(req.params.id);
  const userId = req.session ? req.session.userId : null;
  res.render("app_detail", { app, user: userId });
});

// My Apps page
router.get("/my", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const apps = await App.find({ userId: req.session.userId });
  res.render("my_apps", { apps });
});

// New app upload page
router.get("/new", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("new_app");
});

router.post(
  "/new",
  upload.fields([{ name: "apk" }, { name: "screenshot" }]),
  async (req, res) => {
    if (!req.session.userId) return res.redirect("/login");

    const newApp = new App({
      name: req.body.name,
      description: req.body.description,
      details: req.body.details,
      apk: req.files.apk[0].path,
      screenshot: req.files.screenshot ? req.files.screenshot[0].path : null,
      userId: req.session.userId,
    });

    await newApp.save();
    res.redirect(`/app/${newApp._id}`);
  }
);

// Delete an app
router.post("/app/:id/delete", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  await App.deleteOne({ _id: req.params.id, userId: req.session.userId });
  res.redirect("/my");
});

module.exports = router;
