import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

/**
 * 添加学校信息
 */
export const addSchool = (data:any) => {
    return request({
        url: '/super/addSchool',
        method: 'post',
        data:data
    });
};
/**
 * 列举学校信息
 */
export const listSchool = (data:any) => {
    return request({
        url: '/super/schoolList',
        method: 'post',
        data:data
    });
};

/**
 * 更新学校信息
 */
export const updateSchool = (data:any) => {
    return request({
        url: '/super/editSchoolInfo',
        method: 'post',
        data:data
    });
};


/**
 * 删除学校信息
 */
export const delSchool = (uuid:string) => {
    return request({
        url: '/super/delSchoolDetail?schoolCode='+uuid,
        method: 'post'
    });
};

/**
 * 学校详细信息
 */
export const showSchoolDetail = (uuid:string,schoolName:string) => {
    return request({
        url: '/super/showSchoolDetail?schoolCode='+uuid+"&schoolName="+schoolName,
        method: 'post'
    });
};

/**
 * 首页数据展示
 */
export const dashBashInfo = () => {
    return request({
        url: '/super/dashBashInfo',
        method: 'post'
    });
};