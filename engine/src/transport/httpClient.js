const axios = require('axios');

async function sendRequest({ method, url, headers = {}, data = {}, timeout = 5000}) {
    const start = Date.now();

    try{
        const response = await axios({
            method,
            url,
            headers,
            data,
            timeout
        });

        const latency = Date.now() - start;

        return {
            success: true,
            status: response.status,
            latency,
            data: response.data
        }
    }catch(error) {
            const latency = Date.now() - start;

            return{
                success: false,
                status: error.response ? error.response.status : null,
                latency,
                error: error.message
            }
    }
}


module.exports = {
    sendRequest
}