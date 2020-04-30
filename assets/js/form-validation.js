const currentActiveStep = document.querySelector('.main-form .step.active');
const formFields = currentActiveStep.querySelectorAll(
  '.step.active .form-field input'
);
const lang = window.location.pathname.includes('/en') ? 'en' : 'ar';
window.onload = function () {
  fireFieldsEvents();
};

function fireFieldsEvents() {
  formFields.forEach((inp) => {
    inp.addEventListener('keyup', onFieldKeyup);
    inp.addEventListener('blur', onFieldBlur);
    // Create small element to contain error msg
    let small = document.createElement('small');
    inp.closest('.form-group').appendChild(small);
  });
}

function onFieldKeyup(e) {
  if (e.target.checkValidity()) {
    e.target.closest('.form-group').classList.remove('invalid');
    e.target.classList.add('valid');
  } else {
    e.target.classList.remove('valid');
  }
  activateSubmitBtn();
}

const errorRequiredMsg = {
  en: 'This field is required',
  ar: 'هذا الحقل مطلوب لإتمام الطلب',
};
let formGroup;
function onFieldBlur(e) {
  formGroup = e.target.closest('.form-group');
  if (e.target.checkValidity()) {
    formGroup.classList.remove('invalid');
    e.target.classList.add('valid');
  } else {
    formGroup.classList.add('invalid');
    if (e.target.value.trim() == '') {
      formGroup.querySelector('small').innerHTML = errorRequiredMsg[lang];
    } else {
      e.target
        .closest('.form-group')
        .querySelector('small').innerHTML = e.target.getAttribute(
        'data-err-msg'
      );
    }
  }
  activateSubmitBtn();
}

function activateSubmitBtn() {
  let submitBtn = currentActiveStep.querySelector('.main-btn');
  let inValidFields = [].some.call(
    formFields,
    (inp) => !inp.classList.contains('valid')
  );
  if (!inValidFields) {
    submitBtn.removeAttribute('disabled');
    submitBtn.classList.add('active');
  } else {
    submitBtn.setAttribute('disabled', '');
    submitBtn.classList.remove('active');
  }
}
