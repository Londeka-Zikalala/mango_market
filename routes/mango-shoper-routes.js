function mangoShopperRoutes(mangodb){
    async function showIndex(req, res, next) {
        try {
            // get the deals from the database
            let deals = await mangodb.topFiveDeals()
                console.log(deals)
                res.render('index', {
                deals//display the deals
            })
        } catch (error) {
            console.error(error.message)
            next(error)
        }
    }
    async function recommededDealsRoute(req, res, next) {
        try {
            //get the amount 
            let amount = req.body.amount
            let deals = await mangodb.recommendDeals(amount);
            res.render('index', {
                deals
            })
        }catch (error) {
            console.error(error.message)
            next(error)
        }
    }

    async function allShopsRoute(req, res, next) {
        try {
            let allShops = await mangodb.listShops()
            res.render('all', {
                allShops
            })
        }catch (error) {
            console.error(error.message)
            next(error)
        }
    }

    async function createDealRoute(req, res, next) {
        try {
            let shopName = req.body.shopName;
            let price = req.body.price;
            let quantity = req.body.quantity;

            await mangodb.createDeal(shopName, price, quantity)
            
            res.render('create')
        
        }
        catch (error) {
            console.error(error.message)
            next(error)
        }
    }
    return {
        showIndex,
        recommededDealsRoute,
        allShopsRoute,
        createDealRoute
    }
}


export default mangoShopperRoutes