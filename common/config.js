/*
development  =>  开发环境
localhost    =>  本地环境
production   =>  生产环境
*/
export const ENV = 'development';

const config = {
	development: {
		// BASE_URL: '/api/game/public/index.php',
		BASE_URL: '/api/game/public/index.php',
		IMG_HOST: '/static/'
	},
	localhost: {
		BASE_URL: '',
		IMG_HOST: ''
	},
	production: {
		BASE_URL: '',
		IMG_HOST: ''
	}
};


export const BASE_URL = config[ENV].BASE_URL;
export const IMG_HOST = config[ENV].IMG_HOST;
