 function mangoShopper(db){

	 async function createShop(shopName) {
		 try {
			  //It must insert a unique shop to the shop table
		await db.none(`INSERT INTO shop (name) VALUES ($1)
		ON CONFLICT DO NOTHING`, [shopName]);
			 
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
		
	}

	async function topFiveDeals() {
		

	}

	async function createDeal(shopId, qty, price) {
		
	}

	async function recommendDeals(amount) {
	
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