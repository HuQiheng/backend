const { Client } = require('pg');

const getUserInfo = async (id) => {
    /*
    const client = new Client({

    });

    try {
        await client.connect();

        const res = await client.query('SELECT * FROM Player WHERE email = $1', [id]);

        await client.end();

        return res.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
    */
    return {
        id: id,
        name: 'Napoleon Bonaparte',
        email: 'napoleon.bonaparte@gmail.com',
    };
};

module.exports = {
    getUserInfo
};