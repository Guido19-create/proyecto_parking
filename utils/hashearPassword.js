import bcryptjs from "bcryptjs"

export const hashPassword = ( password ) => {
    return bcryptjs.hashSync( password ,10 );
}

export const verifyPassword = ( newPassword,passwordDB ) => {
    return bcryptjs.compareSync(newPassword,passwordDB);
}