let BASE_URL: string;

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'https://a9ccf582-e1ef-4d00-891a-4e40f24c2459.mock.pstmn.io';
} else if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://a9ccf582-e1ef-4d00-891a-4e40f24c2459.mock.pstmn.io';
} else {
    BASE_URL = 'https://a9ccf582-e1ef-4d00-891a-4e40f24c2459.mock.pstmn.io';
}

export { BASE_URL };
