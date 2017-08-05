'use strict';

//@prepros-append babel/_nav.js
//@prepros-append babel/_form.js

/* Toggle Responsive Nav Start */
var navIsOn = false;
function toggleNav() {
  navIsOn = !navIsOn;
  var btns = document.querySelectorAll('.nav_btn');
  var hr = document.querySelector('.nav_hr');

  if (navIsOn) {
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.add('nav_btn-on');
    }
    hr.classList.add('nav_btn-on');
  } else {
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('nav_btn-on');
    }
    hr.classList.remove('nav_btn-on');
  }
}

document.getElementById('nav_toggle').addEventListener("click", toggleNav
/* Toggle Responsive Nav End */

/* Smooth Scroll Start */
);$(document).ready(function () {
  var navHeight = $('nav').outerHeight();
  $('.nav_anchor').click(function (x) {
    var linkHref = $(this).attr('href');
    x.preventDefault();
    if (navIsOn) {
      toggleNav();
    } // - toggle off nav
    $('html, body').delay(150).animate({
      scrollTop: $(linkHref).offset().top - navHeight
    }, 800);
  });
});
/* Smooth Scroll End */

/* Nav Sticky Start */
$(function () {
  $(document).on('scroll', function () {
    if ($(window).scrollTop() >= $("#hero").height()) {
      $("#nav").addClass("nav_fixed-on");
      $("#nav_ghost").addClass("nav_ghost");
    }
    if ($(window).scrollTop() < $("#hero").height()) {
      $("#nav").removeClass("nav_fixed-on");
      $("#nav_ghost").removeClass("nav_ghost");
    }
  });
});
/* Nav Sticky End */

// taken from:
// https://github.com/dwyl/html-form-send-email-via-google-script-without-server
function validEmail(email) {
  // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
// get all data in form and return object
function getFormData() {
  var elements = document.getElementById("gform").elements; // all form elements
  var fields = Object.keys(elements).map(function (k) {
    if (elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    } else if (elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function (item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function (k) {
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
    // it to be appended to for each item in the loop
    if (elements[k].type === "checkbox") {
      // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append
      // the current checked value to
      // the end of it, along with
      // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space
      // from the  string to make the output
      // prettier in the spreadsheet
    } else if (elements[k].length) {
      for (var i = 0; i < elements[k].length; i++) {
        if (elements[k].item(i).checked) {
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });
  // console.log(data);
  return data;
}

function handleFormSubmit(event) {
  // handles form submit withtout any jquery
  event.preventDefault(); // we are submitting via xhr below
  var data = getFormData(); // get the values submitted in the form
  if (!validEmail(data.email)) {
    // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action; //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      // console.log( xhr.status, xhr.statusText )
      // console.log(xhr.responseText);
      document.getElementById('gform').style.display = 'none'; // hide form
      document.getElementById('form_aside').style.display = 'none'; // hide aside
      document.getElementById('thankyou_message').style.display = 'block';
      return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
    xhr.send(encoded);
  }
}
function loaded() {
  // console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);