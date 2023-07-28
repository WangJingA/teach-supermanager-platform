import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

export const supermanagerlogin = (data:any) => {
    return request({
        url: '/super/login',
        method: 'post',
        data:data
    });
};
