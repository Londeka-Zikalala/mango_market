 function mangoShopper(db){

	 async function createShop(shopName) {
		 try {
			 // Check if the shop already exists
		let shop = await db.oneOrNone(`SELECT * FROM shop WHERE name = $1`, [shopName]);

		// If the shop doesn't exist, insert it into the shop table
		if (!shop) {
			shop = await db.one(`INSERT INTO shop (name) VALUES ($1) RETURNING *`, [shopName]);
		}

			 return shop
	  
		 } catch (error) {
			 console.log(error.message)
		 }
		

	}

	 async function listShops() {
		 try {
			//get all the shops from the shop table 
		let allShops = await db.manyOrNone(`SELECT * FROM shop`);
		//return the allShopsArray
		return allShops
		 }
		 catch (error) {
			 console.error(error.message)
		 }
		
	}

	async function dealsForShop(shopId) {
		try {
			//get shop
			let shop = await db.oneOrNone(`SELECT * FROM shop WHERE id = $1`, [shopId]);
			if (shop) {
				// Get all the deals for a specific shop from the mango_deal table, including the unit_price column
				let deals = await db.manyOrNone(`SELECT mango_deal.*, shop.name as shop_name, (price / qty) as unit_price FROM mango_deal INNER JOIN shop ON mango_deal.shop_id = shop.id WHERE shop_id = $1`, [shopId]);
				// Return the deals array
				return deals;
			}
		} catch (error) {
			console.error(error.message)
		}
	}

	async function topFiveDeals() {
		try {
			// Get the top 5 deals based on the price from the mango_deal table
			//it must arrange the deals into ascending order and get the first 5 
			let topDeals = await db.manyOrNone(`SELECT mango_deal.*, shop.name as shop_name, (price / qty) as unit_price FROM mango_deal INNER JOIN shop ON mango_deal.shop_id = shop.id ORDER BY unit_price ASC LIMIT 5`);
			// Return the topDeals array
			
			return topDeals;
		} catch (error) {
			console.error(error.message)
		}
	}

	async function createDeal(shopName, qty, price) {
		try {
			
			// Get the shop_id from the shop table using the shop name
			let shop = await createShop(shopName)
			console.log(shop)

			// It must insert a deal into the mango_deal table
			let deal = await db.one(`INSERT INTO mango_deal (shop_id, qty, price) VALUES ($1, $2, $3) RETURNING *`, [shop.id, qty, price]);
			return deal
		} catch (error) {
			console.log(error.message)
		}
	}

	async function recommendDeals(amount) {
		try {
			// Get all the deals where the price is less than or equal to the amount inserted by the user
			let recommendedDeals = await db.manyOrNone(`SELECT * FROM mango_deal WHERE price <= $1`, [amount]);
			// Return the recommendedDeals array
			return recommendedDeals;
		} catch (error) {
			console.error(error.message)
		}
	}

	return {
		createDeal,
		createShop,
		listShops,
		dealsForShop,
		recommendDeals,
		topFiveDeals
	}


}

export default mangoShopper