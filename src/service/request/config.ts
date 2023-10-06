let BASE_URL: string;

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'https://tongxinshequ.cn';
} else if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://tongxinshequ.cn';
} else {
    BASE_URL = 'https://tongxinshequ.cn';
}

export { BASE_URL };
