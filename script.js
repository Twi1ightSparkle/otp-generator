const authenticator = window.otplib.authenticator;

const secretId = document.getElementById('secret');
const otpId = document.getElementById('otp');
const secondsId = document.getElementById('seconds');
const progressbarId = document.getElementById('progressbar');
const copyId = document.getElementById('copy');
const secretError = document.getElementById('secretError');

let lastOtp;

const copy = () => {
    navigator.clipboard.writeText(lastOtp);

    copyId.classList.remove('fa-copy');
    copyId.classList.add('fa-check');
    setTimeout(() => {
        copyId.classList.remove('fa-check');
        copyId.classList.add('fa-copy');
    }, 2000);
};

const countdown = () => {
    const timeRemaining = authenticator.timeRemaining();
    const percentage = (timeRemaining / 30) * 100;
    progressbarId.style = `width: ${percentage}%`;
    progressbarId['aria-valuenow'] = percentage;
    secondsId.textContent = timeRemaining;
};

const error = (errorText) => {
    console.log(errorText);
    if (errorText) {
        secretId.classList.add('is-invalid');
        secretError.hidden = false;
        secretError.textContent = errorText;
        otpId.textContent = '';
        lastOtp = '';
    } else {
        secretId.invalid = false;
        secretId.classList.remove('is-invalid');
        secretError.hidden = true;
    }
};

const generateOTP = () => {
    const secret = secretId.value.replaceAll(' ', '');

    let otp;
    try {
        otp = authenticator.generate(secret);
    } catch (err) {
        return error(err);
    }

    error(null);
    if (otp !== lastOtp) otpId.textContent = otp;
    lastOtp = otp;
};

secretId.addEventListener('input', (e) => {
    generateOTP();
});

window.onload = function () {
    countdown();
    generateOTP();
    setInterval(countdown, 1000);
    setInterval(generateOTP, 1000);
    document.querySelector('#current-url').textContent = window.location.host;
};
