import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";



function validateOTP(password, callback){
    let request = new Request(HOST.backend_api + "/OTP/validateOTP" , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(password)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function generateOTP(callback) {
    let request = new Request(HOST.backend_api + "/OTP/GenerateOTP", {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    validateOTP,
    generateOTP,
};


