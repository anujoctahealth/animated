



// $Id: $
function zf_ValidateAndSubmit(){
  if(zf_CheckMandatory()){
    if(zf_ValidCheck()){
      if(isSalesIQIntegrationEnabled){
        zf_addDataToSalesIQ();
      }
      return true;
    }else{		
      return false;
    }
  }else{
    return false;
  }
}
  function zf_CheckMandatory(){
  for(i = 0 ; i < zf_MandArray.length ; i ++) {
      var fieldObj=document.forms.form[zf_MandArray[i]];
      if(fieldObj) {  
          if(fieldObj.nodeName != null ){
            if ( fieldObj.nodeName=='OBJECT' ) {
              if(!zf_MandatoryCheckSignature(fieldObj)){
                zf_ShowErrorMsg(zf_MandArray[i]);
                 return false;
              }
            }else if (((fieldObj.value).replace(/^\s+|\s+$/g, '')).length==0) {
             if(fieldObj.type =='file')
              { 
               fieldObj.focus(); 
               zf_ShowErrorMsg(zf_MandArray[i]);
               return false;
              } 
                      fieldObj.focus();
                      zf_ShowErrorMsg(zf_MandArray[i]);
                      return false;
            }  else if( fieldObj.nodeName=='SELECT' ) {// No I18N
                     if(fieldObj.options[fieldObj.selectedIndex].value=='-Select-') {
              fieldObj.focus();
              zf_ShowErrorMsg(zf_MandArray[i]);
              return false;
               }
            } else if( fieldObj.type =='checkbox' || fieldObj.type =='radio' ){
              if(fieldObj.checked == false){
                fieldObj.focus();
                zf_ShowErrorMsg(zf_MandArray[i]);
                return false;
                 } 
            } 
          }else{
            var checkedValsCount = 0;
          var inpChoiceElems = fieldObj;
            for(var ii = 0; ii < inpChoiceElems.length ; ii ++ ){
                  if(inpChoiceElems[ii].checked === true ){
                    checkedValsCount ++;
                  }
            }
            if ( checkedValsCount == 0) {
                inpChoiceElems[0].focus();
                zf_ShowErrorMsg(zf_MandArray[i]);
                return false;
               }
        }
    }
  }
  return true;
}
function zf_ValidCheck(){
  var isValid = true;
  for(ind = 0 ; ind < zf_FieldArray.length ; ind++ ) {
    var fieldObj=document.forms.form[zf_FieldArray[ind]];
      if(fieldObj) {
        if(fieldObj.nodeName != null ){
          var checkType = fieldObj.getAttribute("checktype"); 
          if( checkType == "c2" ){// No I18N
            if( !zf_ValidateNumber(fieldObj)){
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
          }else if( checkType == "c3" ){// No I18N
            if (!zf_ValidateCurrency(fieldObj) || !zf_ValidateDecimalLength(fieldObj,10) ) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
          }else if( checkType == "c4" ){// No I18N
            if( !zf_ValidateDateFormat(fieldObj)){
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
          }else if( checkType == "c5" ){// No I18N
            if (!zf_ValidateEmailID(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
          }
          }else if( checkType == "c6" ){// No I18N
            if (!zf_ValidateLiveUrl(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
            }
          }else if( checkType == "c7" ){// No I18N
            if (!zf_ValidatePhone(fieldObj)) {
            isValid = false;
            fieldObj.focus();
            zf_ShowErrorMsg(zf_FieldArray[ind]);
            return false;
            }
          }else if( checkType == "c8" ){// No I18N
            zf_ValidateSignature(fieldObj);
          }
        }
      }
  }
         return isValid;
}
function zf_ShowErrorMsg(uniqName){
  var fldLinkName;
  for( errInd = 0 ; errInd < zf_FieldArray.length ; errInd ++ ) {
    fldLinkName = zf_FieldArray[errInd].split('_')[0];
    document.getElementById(fldLinkName+"_error").style.display = 'none';
  }
  var linkName = uniqName.split('_')[0];
  document.getElementById(linkName+"_error").style.display = 'block';
}
function zf_ValidateNumber(elem) {
   var validChars = "-0123456789";
   var numValue = elem.value.replace(/^\s+|\s+$/g, '');
   if (numValue != null && !numValue == "") {
     var strChar;
     var result = true;
     if (numValue.charAt(0) == "-" && numValue.length == 1) {
       return false;
     }
     for (i = 0; i < numValue.length && result == true; i++) {
       strChar = numValue.charAt(i);
       if ((strChar == "-") && (i != 0)) {
         return false;
       }
       if (validChars.indexOf(strChar) == -1) {
         result = false;
       }
     }
     return result;
   } else {
     return true;
   }
 }
 function zf_ValidateDateFormat(inpElem){
   var dateValue = inpElem.value.replace(/^\s+|\s+$/g, '');
   if( dateValue == "" ){
     return true;
   }else{
    return( zf_DateRegex.test(dateValue) );
  }
 }
 function zf_ValidateCurrency(elem) {
   var validChars = "0123456789."; 
   var numValue = elem.value.replace(/^\s+|\s+$/g, '');
   if(numValue.charAt(0) == '-'){
     numValue = numValue.substring(1,numValue.length);
   }
   if (numValue != null && !numValue == "") {
     var strChar;
     var result = true;
     for (i = 0; i < numValue.length && result == true; i++) {
       strChar = numValue.charAt(i);
       if (validChars.indexOf(strChar) == -1) {
         result = false;
       }
     }
     return result;
   } else {
     return true;
   }
 }
 function zf_ValidateDecimalLength(elem,decimalLen) {
   var numValue = elem.value;
   if (numValue.indexOf('.') >= 0) {
     var decimalLength = numValue.substring(numValue.indexOf('.') + 1).length;
     if (decimalLength > decimalLen) {
       return false;
     } else {
       return true;
     }
   }
   return true;
 }
 function zf_ValidateEmailID(elem) {
      var check = 0;
      var emailValue = elem.value;
      if (emailValue != null && !emailValue == "") {
          var emailArray = emailValue.split(",");
          for (i = 0; i < emailArray.length; i++) {
              var emailExp = /^[\w]([\w\-.+'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
              if (!emailExp.test(emailArray[i].replace(/^\s+|\s+$/g, ''))) {
                  check = 1;
              }
          }
          if (check == 0) {
              return true;
          } else {
              return false;
          }
      } else {
          return true;
      }
  }
  function zf_ValidateLiveUrl(elem) {
    var urlValue = elem.value;
  if(urlValue !== null && typeof(urlValue) !== "undefined") {
    urlValue = urlValue.replace(/^\s+|\s+$/g, '');
    if(urlValue !== "") {
      var urlregex = new RegExp("^((((h|H)(t|T)|(f|F))(t|T)(p|P)((s|S)?)://[-.\\w]*)|(((w|W){3}\\.)[-.\\w]+))(/?)([-\\w.?,:'/\\\\+=&;%$#@()!~]*)?$"); // Same regex as website_url in security-regex.xml. But single backslash is replaced with two backslashes.
      return(urlregex.test(urlValue));
    }
      }
      return true;
  }
  function zf_ValidatePhone(inpElem){
    var phoneFormat = parseInt(inpElem.getAttribute("phoneFormat")); 
    var fieldInpVal = inpElem.value.replace(/^\s+|\s+$/g, '');
    var toReturn = true ;
    if( phoneFormat === 1 ){
      if(inpElem.getAttribute("valType") == 'code'){
              var codeRexp = /^[+][0-9]{1,4}$/;
              if(fieldInpVal != "" && !codeRexp.test(fieldInpVal)){
             return false;
      }
      }else{
      var IRexp = /^[+]*[()0-9- ]+$/;
      if(inpElem.getAttribute("phoneFormatType") == '2'){
        IRexp = /^[0-9]+$/;
      }
       if (fieldInpVal != "" && !IRexp.test(fieldInpVal)) {
         toReturn = false;
         return toReturn;
       }
       }
     return toReturn;
    }else if( phoneFormat === 2 ){
      var InpMaxlength = inpElem.getAttribute("maxlength");
      var USARexp = /^[0-9]+$/;
      if  ( fieldInpVal != "" && USARexp.test(fieldInpVal) &&  fieldInpVal.length == InpMaxlength ) {
      toReturn = true;
    }else if( fieldInpVal == "" ){
      toReturn = true;
    }else{
      toReturn = false;
    }
    return toReturn;
    }
  }

function zf_ValidateSignature(objElem) {
    var linkName = objElem.getAttribute("compname");
    var canvasElem = document.getElementById("drawingCanvas-"+linkName);
    var isValidSign = zf_IsSignaturePresent(objElem,linkName,canvasElem);
     var hiddenSignInputElem = document.getElementById("hiddenSignInput-"+linkName);
  if(isValidSign){
    hiddenSignInputElem.value = canvasElem.toDataURL();
  }else{
    hiddenSignInputElem.value = "";// No I18N
  }
  return isValidSign;
  }

  function zf_MandatoryCheckSignature(objElem){
    var linkName = objElem.getAttribute("compname");
    var canvasElem = document.getElementById("drawingCanvas-"+linkName);
    var isValid = zf_IsSignaturePresent(objElem,linkName,canvasElem);
  return isValid;
  }

  function zf_IsSignaturePresent(objElem,linkName,canvasElem){
     var context = canvasElem.getContext('2d'); // No I18N
     var canvasWidth = canvasElem.width;
     var canvasHeight = canvasElem.height;
     var canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);
     var signLen = canvasData.data.length;
     var flag = false;
     for(var index =0; index< signLen; index++) {
          if(!canvasData.data[index]) {
              flag =  false;
          }else if(canvasData.data[index]) {
            flag = true;
            break;
          }
     }
  return flag;
  }

function zf_FocusNext(elem,event) {  
   if(event.keyCode == 9 || event.keyCode == 16){
      return;
    }
    if(event.keyCode >=37 && event.keyCode <=40){
       return;
    } 	
    var compname = elem.getAttribute("compname");
    var inpElemName = elem.getAttribute("name");
   if (inpElemName == compname+"_countrycode") { 
     if (elem.value.length == 3) {
       document.getElementsByName(compname+"_first")[0].focus();
     }
   } else if (inpElemName == compname+"_first" ) { 
     if (elem.value.length == 3) {
       document.getElementsByName(compname+"_second")[0].focus();
     }
   }
}






!(function($) {
  "use strict";

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 15;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });



  
  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1
      },
      900: {
        items: 2
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
      aos_init();
    });

    // Initiate venobox (lightbox feature used in portofilo)
    $(document).ready(function() {
      $('.venobox').venobox();
    });
  });

  // Portfolio details carousel
  $(".portfolio-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }
  $(window).on('load', function() {
    aos_init();
  });

})(jQuery);