const currentActiveStep = document.querySelector('.main-form .step.active');
const formFields = currentActiveStep.querySelectorAll(
  '.step.active .form-field input[name]:not([type="radio"])'
);
const lang = window.location.pathname.includes('/en') ? 'en' : 'ar';
window.onload = function () {
  fireFieldsEvents();
};

function fireFieldsEvents() {
  formFields.forEach((inp) => {
    console.log(inp);
    if (inp.type === 'checkbox') {
      inp.addEventListener('click', onCkecked);
    }
    inp.addEventListener('keyup', onKeyup);
    inp.addEventListener('blur', onBlur);
    // Create small element to contain error msg
    let small = document.createElement('small');
    inp.closest('.form-group').appendChild(small);
  });
}

function onCkecked(e) {
  if (e.target.checked) {
    e.target.closest('.form-group').classList.remove('invalid');
    e.target.classList.add('valid');
  } else {
    e.target.classList.remove('valid');
  }
  activateSubmitBtn();
}

function onKeyup(e) {
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
function onBlur(e) {
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

// =============== Dropdown ===============
function loadGetDropdown(dropdown, endpoint, callback) {
  let lang = dropdown.dataset.lang;
  let wrap = dropdown.querySelector('.dropdown-wrap');
  wrap.innerHTML = '';
  dropdown.classList.add('disabled');
  dropdown.classList.remove('empty');
  let btn = dropdown.querySelector('button');
  btn.innerText = btn.dataset.default;
  let input = dropdown.querySelector('input[type=hidden]');
  input.value = '';
  input.classList.remove('valid');
  fetch('https://p40.laywagif.com/api/' + endpoint, {
    method: 'get',
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.data.map((item) => {
        let a = document.createElement('a'),
          id = item.id,
          name = lang === 'ar' ? item.nameAr : item.nameEn;
        a.innerText = name;
        a.addEventListener('click', (e) => {
          e.stopPropagation();
          input.value = id;
          input.classList.add('valid');
          btn.innerText = name;
          dropdown.classList.remove('open');
          if (callback) {
            callback(id);
          }
          activateSubmitBtn();
          return false;
        });
        wrap.append(a);
      });
      if (data.data.length > 0) {
        dropdown.classList.remove('disabled');
      } else {
        dropdown.classList.remove('disabled');
        dropdown.classList.add('empty'); // Dropdown is empty
        input.classList.add('valid');
      }
    });
}

const geoDropdowns = [document.querySelector('.dropdown-geo')];
geoDropdowns.forEach((item) => {
  const btn = item.querySelector('button');
  btn.innerText = btn.dataset.default;
  btn.addEventListener('click', (e) => {
    item.classList.toggle('open');
    item.querySelector('input').value = '';
    item.querySelectorAll('.dropdown-wrap a').forEach((a) => {
      a.classList.remove('hide');
    });
    e.stopPropagation();
    e.preventDefault();
    return false;
  });
  item.querySelector('input[type=text]').addEventListener('keyup', (e) => {
    const val = e.target.value.toString().trim(),
      regexp = new RegExp(val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    item.querySelectorAll('.dropdown-wrap a').forEach((a) => {
      if (!val || regexp.test(a.innerHTML)) {
        a.classList.remove('hide');
      } else {
        a.classList.add('hide');
      }
    });
  });
});

const cityDropdown = document.querySelector('.dropdown-geo[data-param=city]');
loadGetDropdown(cityDropdown, 'cities');
