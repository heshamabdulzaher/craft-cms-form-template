let submittedData = {};
const preOrderPhoneSection = document.querySelector(
  '#preOrderTheDeviceSection'
);
const lang = window.location.pathname.includes('/en') ? 'en' : 'ar';

const languages = {
  en: 'english',
  ar: 'arabic',
  hi: 'hindi',
  bn: 'bengali',
  id: 'indonesia',
  tl: 'tagalog',
  ur: 'urdu',
};

// Let's move to the second step
function moveToSecondStep() {
  let selectedColor = document.querySelector('input[type=radio]#black').checked
    ? 'black'
    : 'silverFrost';
  submittedData.color = selectedColor;
  preOrderPhoneSection.classList.remove('first-step');
  preOrderPhoneSection.classList.add('second-step');
  let colorName = document.querySelector('#aboutDevice .properties span.color');
  if (window.location.pathname === '/en/') {
    colorName.innerHTML = selectedColor === 'black' ? 'Black' : 'Silver';
  } else {
    colorName.innerHTML = selectedColor === 'black' ? 'أسود' : 'فضى';
  }
}

// On the second step let's begin with validation
// Get all inputs
const fields = document.querySelectorAll('.fields-container input[name]');
const submitBtn = document.querySelector('.submitUserDataBtn');
// const checkbox = document.querySelector('#accept-terms');
// checkbox.addEventListener('change', activateSubmitBtn);

fields.forEach((inp) => {
  inp.addEventListener('keyup', activateSubmitBtn);
  inp.addEventListener('blur', onBlur);
});

function onBlur(e) {
  if (e.target.checkValidity()) {
    e.target.closest('.form-group').classList.remove('invalid');
    e.target.classList.add('valid');
  } else {
    e.target.closest('.form-group').classList.add('invalid');
    if (e.target.value.trim() == '') {
      e.target.closest('.form-group').querySelector('small').innerHTML =
        window.location.pathname === '/en/'
          ? 'This field is required'
          : 'هذا الحقل مطلوب لإتمام الطلب';
    } else {
      e.target
        .closest('.form-group')
        .querySelector('small').innerHTML = e.target.getAttribute(
        'data-err-msg'
      );
    }
  }
}

function activateSubmitBtn(e) {
  // Check if the input valid, if yes add new class 'valid'
  if (e && e.target) {
    if (e.target.type != 'checkbox') {
      if (e.target.checkValidity()) {
        e.target.closest('.form-group').classList.remove('invalid');
        e.target.classList.add('valid');
      } else {
        e.target.classList.remove('valid');
      }
    }
  }
  let inValidFields = [].some.call(
    fields,
    (inp) => !inp.classList.contains('valid')
  );
  // If all inputs are valid
  if (!inValidFields) {
    // if (!inValidFields && checkbox.checked) {
    submitBtn.removeAttribute('disabled');
    submitBtn.classList.add('active');
  } else {
    submitBtn.setAttribute('disabled', '');
    submitBtn.classList.remove('active');
  }
}

submitBtn.addEventListener('click', function () {
  // if (grecaptcha) {
  //   grecaptcha.ready(submitUserData);
  // } else {
  //   submitUserData;
  // }
  submitBtn.disabled = true;
  const form = document.querySelector('form');
  submitForm(form);
});

function submitUserData() {
  submitBtn.classList.add('btn-spinner');
  [].forEach.call(fields, (inp) => {
    if (inp.type !== 'checkbox') {
      submittedData[inp.getAttribute('name')] = inp.value;
    }
  });
  if (submittedData.mobile.substr(0, 1) !== '+') {
    submittedData.mobile = '+966' + submittedData.mobile;
  }
  if (submittedData.cityId) {
    submittedData.cityId = Number.parseInt(submittedData.cityId);
  } else {
    submittedData.cityId = null;
  }
  if (submittedData.districtId) {
    submittedData.districtId = Number.parseInt(submittedData.districtId);
  } else {
    submittedData.districtId = null;
  }

  grecaptcha
    .execute('6Lcs0-cUAAAAAIYIBZ8LbZg_uGGkYXnTZ1J3m5Kf', { action: 'homepage' })
    .then((token) => {
      submittedData.recaptchaToken = token;
      fetch('https://p40.laywagif.com/api/preorders', {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittedData),
      })
        .then((res) => res.json())
        .then((res) => {
          submitBtn.classList.remove('btn-spinner');
          document.querySelector('#userInfoForm').reset();
          if (res.success) {
            preOrderPhoneSection.classList.remove('second-step');
            preOrderPhoneSection.classList.add('congrats');
            document.querySelector('.alert-err-msg').classList.remove('show');
          } else {
            // Show alert error message and desActive submit-btn
            console.log(res);
            document.querySelector('.alert-err-msg').classList.add('show');
            submitBtn.setAttribute('disabled', '');
            submitBtn.classList.remove('active');
          }
        })
        .catch((e) => {
          console.log(e);
          // Show alert error message and desActive submit-btn
          submitBtn.classList.remove('btn-spinner');
          document.querySelector('.alert-err-msg').classList.add('show');
          submitBtn.setAttribute('disabled', '');
          submitBtn.classList.remove('active');
        });
    });
}

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
// const geoDropdowns = document.querySelectorAll('.dropdown-geo');

geoDropdowns.forEach((item) => {
  const btn = item.querySelector('button');
  btn.innerText = btn.dataset.default;
  btn.addEventListener('click', (e) => {
    // let otherDataParam =
    //   item.getAttribute('data-param') === 'city' ? 'district' : 'city';
    // let otherDropdown = document.querySelector(
    //   `.dropdown-geo[data-param="${otherDataParam}"]`
    // );
    // otherDropdown.classList.remove('open');
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
loadGetDropdown(cityDropdown, 'cities', (id) => {
  // loadGetDropdown(districtDropdown, 'districts?city=' + id);
});

// Show & close modal
function openModal(id) {
  let modal = document.querySelector(`#${id}`);
  modal.classList.add('open');
}
function closeModal(id) {
  console.log('......', id);
  let modal = document.querySelector(`#${id}`);
  modal.classList.remove('open');
}

const devicesIds = {
  '1': 'iPhone11pro',
  '2': 'samsungS20',
};
let deviceId = 1;
function onRadioBtnChecked(e) {
  let activeImg = document.querySelector('.about-phone img.active');

  const labels = document.querySelectorAll('.radio-btns label')
  for (var label of labels) {
    label.classList.remove('active');
  }
  e.target.parentElement.classList.add('active');
  
  activeImg.classList.remove('active');
  deviceId = e.target.value;
  document
    .querySelector(`.about-phone img#${devicesIds[e.target.value]}`)
    .classList.add('active');
}

function showConfirmationMsg(form) {
  const successMsg = document.getElementById('successMsg');
  const loadingMsg = document.getElementById('loading-msg');

  loadingMsg.classList.remove('active');
  successMsg.classList.add('active');
}

function loadingForm(form) {
  const loadingMsg = document.getElementById('loading-msg');
  form.classList.remove('active');
  loadingMsg.classList.add('active');
}

function showForm(form) {
  const loadingMsg = document.getElementById('loading-msg');
  const successMsg = document.getElementById('successMsg');

  loadingMsg.classList.remove('active');
  successMsg.classList.remove('active');
  submitBtn.disabled = false;
  form.classList.add('active');
}

function getFormValues(form) {
  const params = {};
  for (var i = 0; i < form.elements.length; i++) {
    const fieldName = form.elements[i].name;
    const fieldValue = form.elements[i].value;

    if (fieldName) params[fieldName] = fieldValue;
  }

  return params;
}

function postForm(form) {
  const data = getFormValues(form);

  data.color = 'black';
  data.mobile = '+966' + data.mobile;
  data.languageSource = window.language;
  data.formSource = 'devices';
  data.deviceOptionId = deviceId;

  grecaptcha
    .execute('6Lcs0-cUAAAAAIYIBZ8LbZg_uGGkYXnTZ1J3m5Kf', {
      action: 'homepage',
    })
    .then((token) => {
      data.recaptchaToken = token;
      fetch('https://p40.laywagif.com/api/preorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            showForm(form);
            renderErrMsg(data.name);
          } else {
            submitBtn.classList.add('no-showing');
            showConfirmationMsg(form);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
}

function submitForm(form) {
  loadingForm(form);
  postForm(form);
}
