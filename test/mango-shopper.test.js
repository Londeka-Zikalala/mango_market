import assert from 'assert';
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import mangoShopper from '../mango-shopper.js';

dotenv.config();

const pgp = pgPromise();
// TODO configure this to work.
const connectionString = process.env.DATABASE_URL;

const db = pgp(connectionString);

describe('The mango shopper', function () {
    this.timeout(6000)
    beforeEach(async function () {
        await db.none(`delete from mango_deal;`)
        await db.none(`delete from shop;`)
    });

    it('should be able to create a shop', async function () {

        const mangoShopperT = mangoShopper(db);

        await mangoShopperT.createShop('Mango Market');
        const shops = await await mangoShopperT.listShops();

        assert.equal('Mango Market', shops[0].name);
    });

    it('should be able to return a list of all shops', async function () {

        const mangoShopperT = mangoShopper(db);

        const beforeShops = await mangoShopperT.listShops();
        assert.deepStrictEqual(0, beforeShops.length);

        await mangoShopperT.createShop('Mango Market');
        await mangoShopperT.createShop('Mangos to Go');
        await mangoShopperT.createShop('Corner Veggies');

        const shops = await mangoShopperT.listShops();
        assert.deepStrictEqual(3, shops.length);

    });

    it('should be able to create an mango deal and find it again', async function () {

        const mangoShopperT = mangoShopper(db);

        const shopId = await mangoShopperT.createShop('Mango Market');
        let deal = await mangoShopperT.createDeal(shopId, 5, 28);

        assert.equal(deal,{
            id: 175,
            price: '28.00',
            qty: 5,
            shop_id: 291
          }
          );
    })

    it('should return all the deals for a given shop', async function () {

        const mangoShopperT = mangoShopper(db);
        const shopId1 = await mangoShopperT.createShop('Mango Market');
        shopId2 = await mangoShopperT.createShop('Mango Stall')
        const deal1 = await mangoShopperT.createDeal(shopId1, 5, 28);
        const deal2 = await mangoShopperT.createDeal(shopId2, 4, 28)
            const fetchDeal1 = await mangoShopperT.dealsForShop(shopId1)
        assert.deepEqual(fetchDeal1, []);

    });

    it('should return the top 5 deals', async function () {

        const mangoShopperT = mangoShopper(db);

        const shopId1 = await mangoShopperT.createShop('Mango Market');
        const shopId2 = await mangoShopperT.createShop('Max Mangos');

        const createDeals = [
            mangoShopperT.createDeal(shopId1, 5, 38),
            mangoShopperT.createDeal(shopId2, 4, 35),
            mangoShopperT.createDeal(shopId1, 4, 28),
            mangoShopperT.createDeal(shopId1, 3, 28),
            mangoShopperT.createDeal(shopId2, 2, 28),
            mangoShopperT.createDeal(shopId1, 1, 28),
            mangoShopperT.createDeal(shopId1, 3, 32),
            mangoShopperT.createDeal(shopId1, 2, 28)];

        await Promise.all(createDeals);

        const topFiveDeals = await mangoShopperT.topFiveDeals();

        assert.equal(5, topFiveDeals.length);

        const expectedDeals = [
            {
                "price": "28.00",
                "qty": 4,
                "shop_name": "Mango Market",
                "unit_price": "7.00",
            },
            {
                "price": "38.00",
                "qty": 5,
                "shop_name": "Mango Market",
                "unit_price": "7.60",
            },
            {
                "price": "35.00",
                "qty": 4,
                "shop_name": "Max Mangos",
                "unit_price": "8.75"
            },
            {
                "price": "28.00",
                "qty": 3,
                "shop_name": "Mango Market",
                "unit_price": "9.33"
            },
            {
                "price": "32.00",
                "qty": 3,
                "shop_name": "Mango Market",
                "unit_price": "10.67"
            }
        ];

        assert.deepStrictEqual(expectedDeals, topFiveDeals)

    });


    it('should return the recommeded deals', async function () {

        const mangoShopperT = mangoShopper(db);

        const shopId1 = await mangoShopperT.createShop('Mango Market');
        const shopId2 = await mangoShopperT.createShop('Max Mangos');

        const createDeals = [
            mangoShopperT.createDeal(shopId1, 5, 40),
            mangoShopperT.createDeal(shopId2, 4, 35),
            mangoShopperT.createDeal(shopId1, 4, 28),
            mangoShopperT.createDeal(shopId1, 3, 28),
            mangoShopperT.createDeal(shopId2, 2, 25),
            mangoShopperT.createDeal(shopId1, 1, 15),
            mangoShopperT.createDeal(shopId1, 3, 32)];

        await Promise.all(createDeals);

        const recommendDeals = await mangoShopperT.recommendDeals(30);

        assert.equal(4, recommendDeals.length);

        const expectedDeals = [

            {
                "name": "Mango Market",
                "price": "28.00",
                "qty": 4,
                "unit_price": "7.00"
            },
            {
                "name": "Mango Market",
                "price": "28.00",
                "qty": 3,
                "unit_price": "9.33"
            },
            {
                "name": "Max Mangos",
                "price": "25.00",
                "qty": 2,
                "unit_price": "12.50"
            },
            {
                "name": "Mango Market",
                "price": "15.00",
                "qty": 1,
                "unit_price": "15.00"
            }
        ];

        assert.deepStrictEqual(expectedDeals, recommendDeals)

    });


    after(function () {
        db.$pool.end()
    });

});