/**
 * @author Jayesh Prajapati
 * @date 2021-04-29 22:18:42
 * 
 */
const uuid = require('uuid');
const _ = require('lodash');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

const add = (req, res, next) => {
    try {
        const db = req.app.get('db');
        const { name, date, opening_balance } = req.body;
        const UUID = uuid.v4();
        db.run(`INSERT INTO bid VALUES(?,?,?,?)`, [UUID, name, date, opening_balance], function (err) {
            if (err) {
                console.log(err.message);
                return res.status(500).jsonp({
                    status: 'error',
                    message: err.message || 'Something broke!'
                });
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
        return res.status(200).jsonp({
            status: 'success',
            message: 'Success',
            data: {
                uuid: UUID,
                name: name,
                date: date,
                opening_balance: opening_balance
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: error.message || 'Something broke!'
        });
    }
}

const post_bid = (req, res, next) => {
    const uuid = req.params.uuid;
    const { price } = req.body;
    let output;
    let status;
    try {
        const db = req.app.get('db');

        const query = `SELECT MAX(price) as max FROM bid_history WHERE bid_id = ?`;
        db.get(query, [uuid], (err, row) => {
            if (err) {
                console.log(err.message);
                return res.status(500).jsonp({
                    status: 'error',
                    message: err.message || 'Something broke!'
                });
            }
            output = _.get(row, 'max');
            if (price >= output) {
                status = 'Higher';
            }
            if (price <= output) {
                status = 'Lower';
            }
        });

        db.run(`INSERT INTO bid_history VALUES(?,?)`, [uuid, price], function (err) {
            if (err) {
                console.log(err.message);
                return res.status(500).jsonp({
                    status: 'error',
                    message: err.message || 'Something broke!'
                });
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            return res.status(200).jsonp({
                status: 'success',
                score: status
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: error.message || 'Something broke!'
        });
    }
}
module.exports = {
    add,
    post_bid
}