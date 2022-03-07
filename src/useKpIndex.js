import { json } from 'd3';
import { useState, useEffect } from 'react';

const jsonUrl = 'https://gist.githubusercontent.com/Amandisen/15b1c7444a0e5fd338ae5f971bc05464/raw/b87d03ecc0064f7a13576b0a476c059a02e74b5e/sunKp_polygon.json';

export const useKpIndex = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        json(jsonUrl).then(setData);
    }, []);
    return data;
}