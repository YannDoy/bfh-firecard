import {token, receiveFHIRMessage, answerFHIRMessage} from "midata-nodejs";

const bearerToken = token()
const message = receiveFHIRMessage()
console.log(message)