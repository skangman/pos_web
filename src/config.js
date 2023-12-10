const config = {
    // api_path: 'http://localhost:3000',
    api_path: 'https://pos-api-kh7r.onrender.com/',
    token_name: 'pos_token',
    headers: () => {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('pos_token')
            }
        }
    }
}

export default config;