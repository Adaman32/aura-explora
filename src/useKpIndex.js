import { json } from 'd3';
import { useState, useEffect } from 'react';

const jsonUrl = 'https://gist.githubusercontent.com/Amandisen/15b1c7444a0e5fd338ae5f971bc05464/raw/176181fef12471b0b53f397064a69d6674b4de0c/sunKp_polygon.json';

export const useKpIndex = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        json(jsonUrl).then(setData);
    }, []);
    return data;
}