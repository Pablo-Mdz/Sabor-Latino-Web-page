const router = require("express").Router();
const Restaurant = require("../models/restaurant.model");

//create restaurant
router.get('/restaurants/create', (req, res) => {
    res.render('restaurants/new')
});


// read restaurant
// router.get('/restaurants/read', (req, res) => {
//     Restaurant.find()
//     .then(restaurant => res.render('restaurants', { restaurant }))
//     .catch(err => console.log(err))
//     res.render('restaurants/details')
// });


router.post('/restaurants/create', (req, res) => {
    const userId = req.session.user._id
    const { name, description, speciality, tel, url, email, street, houseNumber, area /* owner */ } = req.body
    console.log(req.body)
    Restaurant.create({
        name,
        description,
        speciality,
        tel,
        url,
        email,
        street,
        houseNumber,
        area,
        owner: userId
    })
        .then(createdRestaurant => res.redirect('/profile'))
        .catch(err => res.render("restaurants/new"))
});

//get restaurant
router.get('/restaurants/rest', (req, res) => {
    Restaurant.find()
        .then(restaurant => res.render('restaurants/rest', { restaurant }))
        .catch(err => console.log(err))
});




//get details
router.get("/restaurants/:id", (req, res) => {
    const id = req.params.id

    Restaurant.findById(id)
        .populate("User")
        .then(restaurant => res.render("restaurants/details", { restaurant }))
        .catch(err => console.log(err))
})


//edit service
router.get("/restaurants/:id/edit", async (req, res) => {
    const id = req.params.id
    // Restaurant.findById(id)
    try {
        // const rest = await Restaurant.findById(id).populate("restaurants")
        const restaurant = await Restaurant.findById(id)
        console.log(restaurant)
        res.render("restaurants/edit", restaurant)
    } catch (err) {
        console.log(err)
    }

})

router.post("/restaurants/:id", (req, res) => {
    const id = req.params.id
    const { name, description, speciality, tel, url, email, street, houseNumber, area /* owner */ } = req.body

    const restaurant = {
        name,
        description,
        speciality,
        tel,
        url,
        email,
        street,
        houseNumber,
        area,
    }

    Restaurant.findByIdAndUpdate(id, restaurant)
        .then(createdRestaurant => {
            res.redirect(`/`)
        })
        .catch(err => {
            next(err)
        })
})

//delete restaurant
router.post('/restaurants/:id/delete', (req, res) => {
    const id = req.params.id
    Restaurant.findById(id)

        .then(data => {
            if (data.owner._id.toString() !== req.session.user._id) {
                res.render("restaurants/rest", { message: "Oops! you can not delete." })
            } else {

                Restaurant.findByIdAndRemove(id)
                    .then(deletedRestaurant => res.redirect('/profile'))
            }
        })
        .catch(err => console.log(err))
    // const query = { _id: id }
    // if (req.user.role !== 'admin') {
    //     query.owner = req.user._id
    //  } 
});

module.exports = router;