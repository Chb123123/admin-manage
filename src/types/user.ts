
export interface User {
    userId: number;
    userName: string;
    userPic: string;
    password?: string;
    userSignature: string;
    accountNumber: string;
    userRank: string;
    createTime: string;
    userRankName: string;
}

export interface Register {
    username: string;
    password: string;
    email: string;
}