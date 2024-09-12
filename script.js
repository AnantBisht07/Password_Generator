const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '@!#$`~%^&*()_+={[}]:;",<>/?.';


let password = "";
let passwordLength = 7;
let checkCount = 0;
handleSlider();
// initially set strength indicator color to beige
setIndicatorColor("#ffc");


// set Password length with the help of slider 
 function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
 }

 function setIndicatorColor(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxshadow = `0px 0px 12px 1px ${color}`;
 }

 function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
 }

 function generateRandomNo() {
    return getRandomInt(0,9)
 }

 function generateUpperCase() {
    return String.fromCharCode(getRandomInt(97,122))  // ascii value convertion 
 }

 function generateLowerCase() {
    return String.fromCharCode(getRandomInt(65,90))
 }

 function generateSymbol() {
    const randNum = getRandomInt(0, symbols.length);
    return symbols.charAt(randNum);  // charAt tells where the pointer is standing
 }

 function calcStrength () {
    let hasUpper = false;
    let hasLower = false
    let hasNum = false
    let hasSymbol = false
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicatorColor("#0f0")
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
            setIndicatorColor("#ff0")
    } else (
        setIndicatorColor("#f00")
    )

 }

 async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed"
    }
    copyMsg.classList.add("active");
setTimeout(() => {
    copyMsg.classList.remove("active")
}, 2000);

}



 function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach ((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // corner case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
 }

 function shufflePassword(array){

 // fisher yates method
 for(let i = array.length-1; i>0; i--) {
    const k = Math.floor(Math.random() * (i+1));
    const temp = array[i];
    array[i] = array[k];
    array[k] = temp;
 }
 return array.join('');
}


 allCheckBox.forEach((checkbox) => {
     checkbox.addEventListener('change', handleCheckBoxChange)
     console.log(allCheckBox)
 })  // agar kisi bhi box ki tick ya untik kr rhe hain to handleCheckBoxChange is function m chle jynge or yeh count krega kitne ticked or unticked hain 

 inputSlider.addEventListener('input', (e)=> {
    passwordLength = e.target.value;  //'input': Used to trigger your event handler in response to real-time changes in the value of input element. e: Provides access to details about the event,
    handleSlider();
 })
 copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

 generateBtn.addEventListener('click', ()=> {
    // none of the checkbox are selected
    if(checkCount == 0) 
        return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password 
    password = "";
    // put the content mentioned by checkbox
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNo);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition when all are checked so we atleast add checked characters 
    // The loop adds 4 characters, one from each function. e.g., uppercase, lowercase, numbers, special character
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining addition
    // The second loop fills in the remaining characters randomly, ensuring the password meets the specified passwordLength.
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandomInt(0, funcArr.length);
        password+= funcArr[randIndex]();
    }
    // shuffle the password 
    password = shufflePassword(Array.from(password)); // shuffle krke array ki form mai bhjdiya

    // display in UI
    passwordDisplay.value = password
    // now calculate strength
    calcStrength();
 })