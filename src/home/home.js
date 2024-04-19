import React, {useContext, useEffect, useState} from 'react'
import './home.css';
import {Button, Col, Row, Input, FormGroup} from "reactstrap";

import * as API_HOME from "./api/home-api";

import * as CryptoJS from "crypto-js";
import validate from "./components/validators/home-validators";

export default function Home() {


    const [generatedPassword, setGeneratedPassword] = useState("No password was generated yet.");

    const [passwordValue, setPasswordValue] = useState("");
    const [passwordPlaceholder, setPasswordPlaceholder] = useState("Password");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [passwordValidatorName, setPasswordValidatorName] = useState('length');
    const [passwordValidatorValue, setPasswordValidatorValue] = useState(true);

    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(30);
    const [loginSuccess, setLoginSuccess] = useState(1);

    useEffect(() => {
        let timer = null;
        if(isActive){
            timer = setInterval(() => {
                        setSeconds((seconds) => seconds - 1);
                    }, 1000);
            if(seconds == 0)
            {
                setLoginSuccess(1);
                setIsActive(false);
                setSeconds(30);
                setGeneratedPassword("No password was generated yet.");
                clearInterval(timer);
            }
            else
            {
            }
        }
        return () => {
            clearInterval(timer);
        };

    })

    const handleChange = (event) => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedFormElementValue = value;
        const updatedFormElementTouched = true;
        const updatedFormElementValid = validate(value, passwordValidatorName);

        let formIsValid = true;
        formIsValid = updatedFormElementValid && formIsValid;

        setPasswordValue(updatedFormElementValue);
        setPasswordTouched(updatedFormElementTouched);
        setPasswordValid(updatedFormElementValid);

    };



    const handleSubmit = () => {

        return API_HOME.generateOTP((result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                setIsActive(true);

                let secret = "fghlvdcpouuzixmn";
                let key = CryptoJS.enc.Utf8.parse(secret);

                let decryptedBytes = CryptoJS.AES.decrypt(result, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
                let decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
                setGeneratedPassword(decryptedPassword );
            }
            else {
                window.alert(result);
            }
        });
    }

    const handleLogin = () => {

        let secret = "fghlvdcpouuzixmn";
        let key = CryptoJS.enc.Utf8.parse(secret);

        let encryptedBytes = CryptoJS.AES.encrypt(passwordValue, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        let encryptedString = encryptedBytes.toString();

        return API_HOME.validateOTP(encryptedString, (result, status, error) => {
            console.log(result);
            if (result !== "Incorrect" && (status === 200 || status === 201)) {
                setLoginSuccess(2);
                //window.alert("The password was validated");
                setGeneratedPassword("No password was generated yet.");
            }
            else {
                //window.alert("Invalid password");
                setLoginSuccess(3);
            }
        });
    }


    return (
        <div style={{backgroundColor: '#CBC3E3', height: '100vh'}}>
            <h1 style={{paddingTop: '1vmax', paddingBottom: '2vmax', backgroundColor: '#1B1212', color: 'whitesmoke'}}>One time password generator</h1>
            <Row style={{width: '100%', paddingTop: '4vmax'}}>
            <Col sm={{size: '6', offset: 2}}>
                <h3 style={{textAlign: 'left'}}>Generate a password which will be valid for 30 seconds</h3>
            </Col>
            <Col sm={{size: '2', offset: 0}}>
                <Button style={{backgroundColor: '#751212'}}  type={"submit"} disabled={isActive} onClick={() => handleSubmit()}>  Generate One Time Password </Button>
            </Col>
            </Row>

            <Row style={{width: '100%', paddingTop: '4vmax'}}>
            <Col sm={{size: '6', offset: 2}}>
                <h3 style={{width:'fit-content', display: 'inline-block', float: 'left'}}>{"Generated password: "}</h3>
                <h3 style={{color:'red', width:'fit-content', display: 'inline-block', float: 'left', paddingLeft: '1vmax'}}>{generatedPassword}</h3>
            </Col>
            </Row>

            <Row style={{width: '100%', paddingTop: '4vmax'}}>
                <Col sm={{size: '6', offset: 2}}>
                    <FormGroup id='password'>
                        <Input name='password' id='passwordField' placeholder={passwordPlaceholder}
                           onChange={handleChange}
                           defaultValue={passwordValue}
                           touched={passwordTouched? 1 : 0}
                           valid={passwordValid}
                           required
                        />
                        {passwordTouched && !passwordValid &&
                        <div className={"error-message"}> * Password must contain 8 uppercase or lowercase letters.</div>}
                    </FormGroup>
                </Col>
                <Col sm={{size: '2', offset: 0}}>
                    <Button style={{backgroundColor: '#751212'}} type={"submit"} disabled={!passwordValid} onClick={() => handleLogin()}>  Validate One Time Password </Button>
                </Col>
            </Row>
            {isActive && <h4 style={{marginBottom: '5vmax'}}>Time remaining: {seconds}</h4>}
            {(loginSuccess == 2) && <h4 style={{color: 'red'}}> OTP was validated. </h4>}
            {(loginSuccess == 3) && <h4 style={{color: 'red'}}> Invalid OTP. </h4>}

        </div>
    );
}