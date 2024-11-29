let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './FoodieFinds/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH BY ID

async function fetchRestaurantsByID(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseFloat(req.params.id);
    let results = await fetchRestaurantsByID(id);
    if (results.restaurant.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurant found with id ' + id });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH BY CUISINE

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurant found with cuisine ' + cuisine });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH RESTAURANTS BY FILTERS

async function fetchRestaurantsByFilters(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let results = await fetchRestaurantsByFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurant found with the mentioned filters' });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH RESTAURANTS AND SORT THEIR RATING IN DESC ORDER

async function sortRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortRestaurantsByRating();
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurant found with the mentioned filters' });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH ALL DISHES

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH DISHES BY ID

async function fetchDishesByID(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dish: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = parseFloat(req.params.id);
    let results = await fetchDishesByID(id);
    if (results.dish.length === 0) {
      return res.status(404).json({ message: 'No dish found with id ' + id });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH DISHES BY FILTERS

async function fetchDishesByFilters(isVeg) {
  let query = 'SELECT * FROM restaurants WHERE isVeg = ? ';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;

    let results = await fetchDishesByFilters(isVeg);
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found with the mentioned filters' });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//FETCH DISHES AND SORT THEIR PRICING IN ASCENDING ORDER

async function sortDishesByPricing() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-pricing', async (req, res) => {
  try {
    let results = await sortDishesByPricing();
    if (results.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found with the mentioned filters' });
    }
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
