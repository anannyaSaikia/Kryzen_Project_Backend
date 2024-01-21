const { Router } = require("express")
const { UserDetailsModel } = require("../models/UserDetails.model")
const multer = require('multer')
/* const pdf = require('html-pdf') */
const puppeteer = require('puppeteer');
const fs = require('fs');
const ejs = require('ejs');
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

    const { name, age, address, number } = req.body
    const image = req.file.filename

    let num_array = [];

    for (let i = 1; i <= number; i++) {
        if (i % 3 === 0 && i % 4 === 0) {
            num_array.push("foo-bar");
        } else if (i % 3 === 0) {
            num_array.push("foo")
        } else if (i % 4 === 0) {
            num_array.push("bar")
        } else {
            num_array.push(i)
        }
    }

    await UserDetailsModel.findOneAndDelete(user_id)

    const new_detail = new UserDetailsModel({
        name,
        age,
        address,
        image,
        num_array,
        user_id
    })
    console.log(new_detail)

    try {
        await new_detail.save();
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()

            const pdfContent = fs.readFileSync('documents/template.ejs', 'utf-8')

            const renderedHTML = ejs.render(pdfContent, { name, age, address, num_array, image });
            console.log('Rendered HTML:', renderedHTML);

            await page.setContent(renderedHTML, {
                waitUntil: 'domcontentloaded',
            })

            await page.pdf({ path: 'user.pdf', format: 'A4' })

            await browser.close()
            console.log('PDF generated successfully')
        } catch (error) {
            console.log(error)
        }
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
    res.status(200).sendFile('user.pdf', { root: '.' })
})

module.exports = { formRouter }