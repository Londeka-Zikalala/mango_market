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
                deals//list the deals on the same page
            })
        }catch (error) {
            console.error(error.message)
            next(error)
        }
    }

    async function allShopsRoute(req, res, next) {
        try {
            //get the shops from the database
            let allShops = await mangodb.listShops()
            res.render('all', {
                allShops // show all the shops
            })
        }catch (error) {
            console.error(error.message)
            next(error)
        }
    }

    async function createDealRoute(req, res, next) {
        try {
            //get the variables from the template
            let shopName = req.body.shopName;
            let price = req.body.price;
            let quantity = req.body.quantity;
            let message;
          
            //insert and post the values
            let deal = await mangodb.createDeal(shopName, price, quantity)
           
            // validate the deal
            if (deal) {
                message = "Deal Created !"
                console.log(message, deal)
            }
            //show the page
            res.render('create', {
                message
            })
        
        }
        catch (error) {
            console.error(error.message)
            next(error)
        }
    }

    async function dealsForShopRoute(req, res, next) {
        try {
            let shopId = req.params.shopId;
            let dealsForShop = await mangodb.dealsForShop(shopId)
    
            res.render('shop-deals', {
                dealsForShop
            })
        } catch (error) {
            console.error(error.message)
            next(error)
        }
       
    
    }

    return {
        showIndex,
        recommededDealsRoute,
        allShopsRoute,
        createDealRoute,
        dealsForShopRoute
    }
}


export default mangoShopperRoutes