import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};


//学校管理员创编-学校下拉列表数据
export const schoolList = () => {
    return request({
        url: '/passUse/schoolList',
        method: 'post'
    });
};

//学校管理员创编-随机密码
export const randomPass = () => {
    return request({
        url: '/super/randomPass',
        method: 'post'
    });
};

//学校管理员创编-随机账号
export const randomAcc = () => {
    return request({
        url: '/super/randomAccount',
        method: 'post'
    });
};
//学校管理员创编-创建学校管理员
export const createManager = (data:any) => {
    return request({
        url: '/super/createManager',
        method: 'post',
        data:data
    });
};
//学校管理员创编-管理员列表
export const listManager = (data:any) => {
    return request({
        url: '/super/createManager',
        method: 'post',
        data:data
    });
};
//学校管理员创编-管理员列表-学校uid
export const listManagerBySchoolUid = (data:any) => {
    return request({
        url: '/super/managerBySchoolUid',
        method: 'post',
        data:data
    });
};


//学校管理员创编-管理员列表-保存编辑
export const editManager = (data:any) => {
    return request({
        url: '/super/editManager',
        method: 'post',
        data:data
    });
};