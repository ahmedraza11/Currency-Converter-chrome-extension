var selection = window.getSelection();
var range = selection.getRangeAt(0);
var currencyValue;

if (range) {
  var div = document.createElement('div');
  div.appendChild(range.cloneContents());
  selectedText = div.innerHTML;
}

if (
  (selectedText.length > 1 && selectedText.includes('$')) ||
  selectedText.includes('RS') ||
  selectedText.includes('Rs') ||
  selectedText.includes('rs') 
) {
  var result = decideCalculate(selectedText);
  chrome.runtime.sendMessage({
    title: document.title,
    url: window.location.href,
    summary: result !== 'NaN$' ? result : 'Oops!'
  });
} else {
  chrome.runtime.sendMessage({
    summary: 'Please select...'
  });
}

function seperateSelectedText(selectedText) {
  var seperateFromMoneyIcon
  var isBlock = selectedText.includes('<');
  if (selectedText.includes('$')) {
    seperateFromMoneyIcon = selectedText.split('$');
  } else {
    seperateFromMoneyIcon = selectedText.toLowerCase().split('rs');
  }
  return isBlock
    ? seperateFromMoneyIcon[1].split('</')[0]
    : seperateFromMoneyIcon[1];
}

function decideCalculate(selectedText) {
  var pureSelectedCurrenct = seperateSelectedText(selectedText);
  var _currencyValue = getCurrencyValueFromApi();

  if (selectedText.includes('$')) {
    return 'Rs ' + (_currencyValue * pureSelectedCurrenct).toFixed(2);
  } else if (selectedText.includes('RS') || selectedText.includes('Rs') || selectedText.includes('rs')) {
    return '$ ' + (pureSelectedCurrenct / _currencyValue).toFixed(2);
  }
}


function getCurrencyValueFromApi() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(
    'GET',
    'https://free.currconv.com/api/v7/convert?q=USD_PKR&compact=ultra&apiKey=71cf1dac7a4000ee9970',
    true
  );

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        value = JSON.parse(xmlhttp.responseText).USD_PKR;
      }
    }
  };
  xmlhttp.send(null);
  return value;
}
