import { handleError, handleSuccess } from "../ulits";
const BASE_URL = "https://deploy-mi-test-api.vercel.app";

// Login
export const UserLogin = async ({loginInfo}) => {
    try {
        const url = `${BASE_URL}/auth/login`;
        const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(loginInfo)
        })
        const result = await response.json();
        const {success, message, jwtToken, name, email, role, error} = result;
        if(success){
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUserName', name)
        localStorage.setItem('loggedINUserEmail', email)
        localStorage.setItem('role', role)
        return true;
        }else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }else if(!success){
        handleError(message)
        }
    }
    catch(err) {
        handleError(err);
    }
};

//Signup
export const UserSign = async ({signupInfo}) => {
    try {
        const url = `${BASE_URL}/auth/signup`;
        const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(signupInfo)
        })
        const result = await response.json();
        const {success, message, error} = result;
        if(success) return true;
        else if(error){
            const details = error?.details[0].message;
            handleError(details)
        }
        else if(!success) handleError(message)
    }
    catch(err) {
        handleError(err);
    }
};

//Reset Password
export const UserPasswordReset = async ({id, token, password, confirmPassword}) => {
    try{
        const url = `${BASE_URL}/reset-password/${id}/${token}`;
        const response = await fetch(url, {
        method: "post",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({password, confirmPassword})
        })
        const result = await response.json();
        const {success, message} = result;
        if(success){
        handleSuccess("Password reset Successfully");
        return true;
        }
        else{
        handleError(message);
        }
    }
    catch(err) {
        handleError(err);
    }
};

//Forgot Password
export const UserForgotPassword = async ({email}) => {
    try{
        const url = `${BASE_URL}/forgot-password`;
        const response = await fetch(url, {
        method: "post",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email})
        })
        const result = await response.json();
        const {success, message} = result;
        if(success)  handleSuccess(message);
        else handleError(message);
    }
    catch(err) {
        handleError(err);
    }
};

