import React, { Component } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import firebase from "./firbase";
import './index.css'
import img1 from './images/20547283_6310507.jpg'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      otp: "",
      showFirstForm: true,
    };

    // Initialize Firebase app if needed
    // firebase.initializeApp(firebaseConfig);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  configureCaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.onSignInSubmit();
        console.log("reCAPTCHA verified");
      }
      // defaultCountry : "IN"
    });
  };

  onSignInSubmit = (e) => {
    e.preventDefault();
    this.configureCaptcha();

    const phoneNumber = "+91" + this.state.mobile;
    console.log(phoneNumber);

    const appVerifier = window.recaptchaVerifier;
    const auth = getAuth();

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message.
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");

        // Update state to hide the first form and show the second form
        this.setState({
          showFirstForm: false,
        });
      })
      .catch((error) => {
        console.log("SMS not sent", error);
      });
  };

  onSubmitOTP = (e) => {
    e.preventDefault();
    const code = this.state.otp;
    console.log(code);

    window.confirmationResult.confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(JSON.stringify(user));
        alert("User is verified");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        console.error("Error confirming verification code:", error);
      });
  };

  render() {
    const { showFirstForm } = this.state;

    return (
      <div className="form-container">
        {showFirstForm ? (
          <div >
            <h2 className="font-ligh">OTP Verification</h2>

            <form action="" onSubmit={this.onSignInSubmit}>
              <div id="sign-in-button"></div>
              <img src={img1} alt="first img" />
              <p>Enter your mobile number below to receive the OTP:</p>
              <input type="tel" name="mobile" placeholder="Phone number" required onChange={this.handleChange} />
              <button type="submit">Submit</button>
            </form>
          </div>
        ) : (
          <div>
            <h2>OTP Form</h2>
            <form action="" onSubmit={this.onSubmitOTP}>
            <img src={img1} alt="first img" />
            <p>An OTP has been sent to your mobile number. Please enter the code below to verify your identity:</p>
              <input type="tel" name="otp" maxLength={6} placeholder="Enter OTP" required onChange={this.handleChange} />
              <button type="submit">Submit OTP</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default App;
