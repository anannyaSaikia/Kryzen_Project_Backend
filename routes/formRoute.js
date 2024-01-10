const { Router } = require("express")
const { UserDetailsModel } = require("../models/UserDetails.model")
const multer = require('multer')
const pdf = require('html-pdf')
const pdfTemplate = require('../documents/template')
const formRouter = Router()

/* const upload = multer({ dest: 'uploads/' }) */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

formRouter.post("/add", upload.single('image'), async (req, res) => {
    const user_id = req.user_id

    const { name, age, address } = req.body
    const image = req.file.filename

    await UserDetailsModel.findOneAndDelete(user_id)  

    const new_detail = new UserDetailsModel({
        name,
        age,
        address,
        image,
        user_id
    }) 
    console.log(new_detail)

    try {
        await new_detail.save();
        pdf.create(pdfTemplate({ name, age, address, image }), {}).toFile('user.pdf', (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('PDF generated successfully')
            }
        })
        res.status(200).send({ msg: "Details added successfully" })
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong. Please try again!", error: error })
    }
})

formRouter.get("/data", async (req, res) => {
    const user_id = req.user_id
    try {
        let details = await UserDetailsModel.find({ user_id })
        res.status(200).send({ msg: "data fetched successfully", data: details })
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong." })
    }
})

formRouter.get("/download", async (req, res) => {
    res.status(200).sendFile('user.pdf', {root : '.'})
})

module.exports = { formRouter }